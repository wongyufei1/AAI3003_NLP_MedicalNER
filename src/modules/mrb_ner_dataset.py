import torch

from torch.utils.data import Dataset


class MRBNERDataset(Dataset):
    def __init__(self, data, tokenizer, id2label, label2id, max_len):
        self.tokenizer = tokenizer
        self.label_tokens = [sample["tokens"] for sample in data]
        self.ner_labels = [sample["ner_labels"] for sample in data]
        self.tokens = []
        self.labels = []
        self.max_len = max_len

        for i in range(len(self.label_tokens)):
            sample_tokens = []
            sample_labels = []
            for j in range(len(self.label_tokens[i])):
                text = self.label_tokens[i][j]
                label = self.ner_labels[i][j]

                text_tokens = tokenizer.tokenize(text)
                sample_tokens.extend(text_tokens)

                if label == 0:
                    sample_labels.extend([label] * len(text_tokens))
                else:
                    sample_labels.append(label)
                    ext_label = id2label[label]
                    ext_label = label2id[f"I-{ext_label[2:]}"]
                    sample_labels.extend([ext_label] * (len(text_tokens) - 1))

            self.tokens.append(sample_tokens)
            self.labels.append(sample_labels)

    def __len__(self):
        return len(self.tokens) if len(self.tokens) == len(self.labels) else 0

    def __getitem__(self, idx):
        input_tokens = self.tokens[idx]
        input_labels = self.labels[idx]
        att_mask = [1] * len(input_tokens)

        input_ids = self.tokenizer.convert_tokens_to_ids(input_tokens)

        input_ids = self.pad_and_truncate(input_ids, self.tokenizer.pad_token_id)
        input_labels = self.pad_and_truncate(input_labels, 0)
        att_mask = self.pad_and_truncate(att_mask, 0)

        return {
            "input_ids": torch.as_tensor(input_ids),
            "labels": torch.as_tensor(input_labels),
            "attention_mask": torch.as_tensor(att_mask)
        }

    def pad_and_truncate(self, inputs, pad_id: int):
        if len(inputs) < self.max_len:
            padded_inputs = inputs + [pad_id] * (self.max_len - len(inputs))
        else:
            padded_inputs = inputs[: self.max_len]
        return padded_inputs
