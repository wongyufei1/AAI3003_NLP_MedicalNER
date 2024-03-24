import os
import warnings
import gc

from torch.utils.data import random_split

from datasets import load_dataset
from transformers import AutoTokenizer, DataCollatorForTokenClassification, AutoModelForTokenClassification, TrainingArguments, Trainer

from modules.mrb_ner_config import *
from modules.mrb_ner_dataset import *
from modules.mrb_ner_evaluator import *

warnings.filterwarnings("ignore")


def load_data(data_path):
    # get dataset from huggingface
    data = load_dataset(data_path)

    # extract NER labels
    label_names = data["train"].features["ner_labels"].feature.names
    id2label = {}
    label2id = {}

    for idx, label in enumerate(label_names):
        id2label[idx] = label
        label2id[label] = idx

    # split dataset into train, val and test splits
    data_splits = {}
    data_splits["train"], data_splits["val"], data_splits["test"] = random_split(data["train"], [0.8, 0.1, 0.1])

    return data_splits, id2label, label2id


def train_model(data_splits, id2label, label2id, out_dir, model_paths, batch_size, epochs, lrates, wdecay):
    # config evaluator
    evaluator = MRBNEREvaluator(metric="seqeval", id2label=id2label)

    # train and evaluate 5 pretrained models
    for m in model_paths:
        save = {
            "save_trainer": None,
            "test_metrics": None,
            "param": None
        }
        
        # search for best lr for each model
        for lr in lrates:
            print(f"\n---------------------- Training Model (Model:{m['name']}, Lr:{lr}) ----------------------")

            # initialize tokenizer and model
            tokenizer = AutoTokenizer.from_pretrained(m["path"])
            data_collator = DataCollatorForTokenClassification(tokenizer=tokenizer)
            model = AutoModelForTokenClassification.from_pretrained(
                pretrained_model_name_or_path=m["path"],
                label2id=label2id,
                id2label=id2label,
                ignore_mismatched_sizes=True,
                num_labels=len(label2id)
            )

            # generate dataset classes with model's tokenizer
            datasets = {
                "train": MRBNERDataset(data=data_splits["train"], tokenizer=tokenizer,
                                       id2label=id2label, label2id=label2id, max_len=512),
                "val": MRBNERDataset(data=data_splits["val"], tokenizer=tokenizer,
                                     id2label=id2label, label2id=label2id, max_len=512),
                "test": MRBNERDataset(data=data_splits["test"], tokenizer=tokenizer,
                                      id2label=id2label, label2id=label2id, max_len=512)
            }

            # setup trainer API
            training_args = TrainingArguments(
                output_dir=os.path.join(OUT_DIR, f"{m['name']}/{lr}"),
                overwrite_output_dir=True,
                per_device_train_batch_size=batch_size,
                per_device_eval_batch_size=batch_size,
                num_train_epochs=epochs,
                learning_rate=lr,
                weight_decay=wdecay,
                evaluation_strategy="epoch",
                save_strategy="epoch",
                load_best_model_at_end=True
            )
            trainer = Trainer(
                model=model,
                args=training_args,
                train_dataset=datasets["train"],
                eval_dataset=datasets["val"],
                data_collator=data_collator,
                tokenizer=tokenizer,
                compute_metrics=evaluator.compute_metrics
            )

            # train model and evaluate on test set
            trainer.train()
            predictions, _, metrics = trainer.predict(datasets["test"])

            # select best model
            if save["test_metrics"] is None or save["test_metrics"]["test_overall_accuracy"] < metrics["test_overall_accuracy"]:
                best_accuracy = save['test_metrics']['test_overall_accuracy'] if save['test_metrics'] else None
                print(f"Updating best accuracy: {best_accuracy} -> {metrics['test_overall_accuracy']}")

                save["save_trainer"] = trainer
                save["test_metrics"] = metrics
                save["param"] = lr

        # save final best model
        print(f"\nSaving best {m['name']} model...")
        for key, value in save["test_metrics"].items():
            print(f"{key}: {value}")

        save["save_trainer"].save_model(os.path.join(out_dir, f"{m['name']}/save_model"))

        # save final best model's learning rate and test set's results
        with open(os.path.join(out_dir, f"{m['name']}/save_model_info.txt"), "w+") as f:
            f.write(f"lr,{save['param']}\n")

            for k, v in save["test_metrics"].items():
                f.write(f"{k},{v}\n")

        # clear gpu cache for OOM problem
        del save, tokenizer, data_collator, model, datasets, training_args, trainer, predictions, _, metrics
        gc.collect()
        torch.cuda.empty_cache()


def run():
    # make results reproducible
    np.random.seed(0)
    torch.manual_seed(0)

    data_splits, id2label, label2id = load_data(DATA_PATH)
    train_model(data_splits, id2label, label2id, OUT_DIR, MODEL_PATHS, BATCH_SIZE, EPOCHS, LRATES, WDECAY)


if __name__ == "__main__":
    run()
