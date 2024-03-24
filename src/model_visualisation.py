import json
import os

import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

from modules.mrb_ner_config import *


def compile_model_statistics(dir):
    model_labels = []
    model_results = {}
    model_epoch_losses = {}
    model_epoch_accuracies = {}
    model_epoch_precisions = {}
    model_epoch_recalls = {}

    for m in MODEL_PATHS:
        with open(os.path.join(dir, f"{m['name']}/save_model_info.txt"), "r+") as f:
            lines = f.readlines()

            # get each best model's lr
            lr = lines[0].split(",")[1].strip("\n")
            model_labels.append(f"{m['name']}_{lr}")

            # get each model's result on test set
            for line in lines[1:]:
                line = line.split(",")
                metric = line[0]
                value = float(line[1].strip("\n"))

                if metric not in model_results.keys():
                    model_results[metric] = [value]
                else:
                    model_results[metric].append(value)

        with open(os.path.join(dir, f"{m['name']}/{lr}/checkpoint-350/trainer_state.json"), "r+") as f:
            epoch_metrics = json.load(f)["log_history"]

            # get each model's loss, accuracy, precision, recall
            for metric in epoch_metrics:
                loss = float(metric["eval_loss"])
                accuracy = float(metric["eval_overall_accuracy"])
                precision = float(metric["eval_overall_precision"])
                recall = float(metric["eval_overall_recall"])

                if m['name'] not in model_epoch_losses.keys():
                    model_epoch_losses[m['name']] = [loss]
                    model_epoch_accuracies[m['name']] = [accuracy]
                    model_epoch_precisions[m['name']] = [precision]
                    model_epoch_recalls[m['name']] = [recall]
                else:
                    model_epoch_losses[m['name']].append(loss)
                    model_epoch_accuracies[m['name']].append(accuracy)
                    model_epoch_precisions[m['name']].append(precision)
                    model_epoch_recalls[m['name']].append(recall)

    # convert statistics to dataframe
    model_results = pd.DataFrame.from_dict(model_results, orient="index", columns=model_labels)
    model_epoch_losses = pd.DataFrame.from_dict(model_epoch_losses)
    model_epoch_accuracies = pd.DataFrame.from_dict(model_epoch_accuracies)
    model_epoch_precisions = pd.DataFrame.from_dict(model_epoch_precisions)
    model_epoch_recalls = pd.DataFrame.from_dict(model_epoch_recalls)

    return model_results, model_epoch_losses, model_epoch_accuracies, model_epoch_precisions, model_epoch_recalls


def run():
    results, epoch_losses, epoch_accuracies, epoch_precisions, epoch_recalls = compile_model_statistics(OUT_DIR)

    # save statistics
    results.to_csv(os.path.join(OUT_DIR, "model_results.csv"))
    epoch_losses.to_csv(os.path.join(OUT_DIR, "model_epoch_losses.csv"))
    epoch_accuracies.to_csv(os.path.join(OUT_DIR, "model_epoch_accuracies.csv"))
    epoch_precisions.to_csv(os.path.join(OUT_DIR, "model_epoch_precisions.csv"))
    epoch_recalls.to_csv(os.path.join(OUT_DIR, "model_epoch_recalls.csv"))

    # plot epoch losses
    line_plot = sns.lineplot(data=epoch_losses)
    line_plot.set(xlabel="Epoch", ylabel="Loss", title="Epoch Losses of Models")
    plt.savefig(os.path.join(OUT_DIR, "model_epoch_losses_graph.png"))
    plt.clf()

    # plot epoch accuracies
    line_plot = sns.lineplot(data=epoch_accuracies)
    line_plot.set(xlabel="Epoch", ylabel="Accuracy", title="Epoch Evaluation Accuracies of Models")
    plt.savefig(os.path.join(OUT_DIR, "model_epoch_accuracies_graph.png"))
    plt.clf()

    # plot epoch precisions
    line_plot = sns.lineplot(data=epoch_precisions)
    line_plot.set(xlabel="Epoch", ylabel="Precision", title="Epoch Evaluation Precisions of Models")
    plt.savefig(os.path.join(OUT_DIR, "model_epoch_precisions_graph.png"))
    plt.clf()

    # plot epoch recalls
    line_plot = sns.lineplot(data=epoch_recalls)
    line_plot.set(xlabel="Epoch", ylabel="Recall", title="Epoch Evaluation Recalls of Models")
    plt.savefig(os.path.join(OUT_DIR, "model_epoch_recalls_graph.png"))


if __name__ == "__main__":
    run()
