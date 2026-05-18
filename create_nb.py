import json

notebook = {
  "nbformat": 4,
  "nbformat_minor": 0,
  "metadata": {
    "colab": {
      "provenance": []
    },
    "kernelspec": {
      "name": "python3",
      "display_name": "Python 3"
    },
    "language_info": {
      "name": "python"
    }
  },
  "cells": []
}

def add_markdown(text):
    notebook["cells"].append({
        "cell_type": "markdown",
        "metadata": {},
        "source": [line + "\n" for line in text.split("\n")]
    })

def add_code(text):
    notebook["cells"].append({
        "cell_type": "code",
        "metadata": {},
        "execution_count": None,
        "outputs": [],
        "source": [line + "\n" for line in text.split("\n")]
    })

add_markdown("# Real vs Fake Face Classification\nThis notebook has been cleaned, sorted, and enhanced with a proper training loop, visualizations, and an evaluation process.")

add_code("""!pip install -q kagglehub
import kagglehub
import os
import torch
import torch.nn as nn
import torch.optim as optim
from torchvision import datasets, transforms
from torch.utils.data import DataLoader, random_split
import matplotlib.pyplot as plt
import numpy as np
import torchvision

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"Using device: {device}")""")

add_markdown("## 1. Download Dataset")

add_code("""# Download latest version from Kaggle
path = kagglehub.dataset_download("xhlulu/140k-real-and-fake-faces")
print("Path to dataset files:", path)

# Construct path to the inner directory
data_dir = os.path.join(path, "real_vs_fake", "real-vs-fake")
print("Target data directory:", data_dir)""")

add_markdown("## 2. Data Loading & Transforms\nWe use PyTorch transforms to resize, augment, and normalize our images, then load them into DataLoaders for efficient batching.")

add_code("""transform = transforms.Compose([
    transforms.Resize((64, 64)),
    transforms.RandomHorizontalFlip(),
    transforms.ToTensor(),
    transforms.Normalize([0.5]*3, [0.5]*3)
])

dataset = datasets.ImageFolder(root=data_dir, transform=transform)

print("Classes:", dataset.classes)
print("Total samples:", len(dataset))

train_size = int(0.8 * len(dataset))
test_size = len(dataset) - train_size

train_data, test_data = random_split(dataset, [train_size, test_size])

# Note: Adjust batch_size based on your GPU memory
train_loader = DataLoader(train_data, batch_size=128, shuffle=True)
test_loader = DataLoader(test_data, batch_size=128, shuffle=False)

print("Train size:", len(train_data))
print("Test size:", len(test_data))""")

add_markdown("## 3. Visualize Sample Images\nLet's plot some of the training data to see what we are working with.")

add_code("""def imshow(img, title):
    img = img / 2 + 0.5     # unnormalize
    npimg = img.numpy()
    plt.figure(figsize=(12, 6))
    plt.imshow(np.transpose(npimg, (1, 2, 0)))
    plt.title(title)
    plt.axis('off')
    plt.show()

# Get a batch of training data
dataiter = iter(train_loader)
images, labels = next(dataiter)

# Make a grid from batch (show 8 images)
out = torchvision.utils.make_grid(images[:8])
imshow(out, title=[dataset.classes[x] for x in labels[:8]])""")

add_markdown("## 4. Model Architecture\nDefining a simple Convolutional Neural Network (CNN) for binary classification. We omit the Sigmoid function at the end because `BCEWithLogitsLoss` handles it internally for better numerical stability.")

add_code("""class CNN(nn.Module):
    def __init__(self):
        super().__init__()
        self.conv = nn.Sequential(
            nn.Conv2d(3, 32, 3, padding=1),
            nn.BatchNorm2d(32),
            nn.ReLU(),
            nn.MaxPool2d(2),

            nn.Conv2d(32, 64, 3, padding=1),
            nn.BatchNorm2d(64),
            nn.ReLU(),
            nn.MaxPool2d(2),

            nn.Conv2d(64, 128, 3, padding=1),
            nn.BatchNorm2d(128),
            nn.ReLU(),
            nn.MaxPool2d(2)
        )
        self.fc = nn.Sequential(
            nn.Flatten(),
            nn.Linear(128 * 8 * 8, 128),
            nn.ReLU(),
            nn.Dropout(0.5),
            nn.Linear(128, 1) # Raw logits output
        )

    def forward(self, x):
        x = self.conv(x)
        return self.fc(x)

model = CNN().to(device)
print(model)""")

add_markdown("## 5. Training Loop\nTrain the model, calculate loss, and update weights.")

add_code("""criterion = nn.BCEWithLogitsLoss()
optimizer = optim.Adam(model.parameters(), lr=0.001)

num_epochs = 5 # Increase for better accuracy
train_losses = []

print("Starting Training...")
for epoch in range(num_epochs):
    model.train()
    running_loss = 0.0
    for i, (images, labels) in enumerate(train_loader):
        images = images.to(device)
        # Labels need to be float and shaped as [batch_size, 1] for BCELoss
        labels = labels.to(device).float().unsqueeze(1)
        
        optimizer.zero_grad()
        outputs = model(images)
        loss = criterion(outputs, labels)
        
        loss.backward()
        optimizer.step()
        
        running_loss += loss.item()
        
        if (i+1) % 200 == 0:
            print(f"Epoch [{epoch+1}/{num_epochs}], Step [{i+1}/{len(train_loader)}], Loss: {loss.item():.4f}")
            
    epoch_loss = running_loss / len(train_loader)
    train_losses.append(epoch_loss)
    print(f"--- Epoch {epoch+1} finished. Average Loss: {epoch_loss:.4f} ---")""")

add_markdown("## 6. Training Progress Visualization\nLet's plot the training loss over the epochs to ensure the model is learning.")

add_code("""plt.figure(figsize=(8, 5))
plt.plot(range(1, num_epochs+1), train_losses, marker='o', color='b', label='Training Loss')
plt.xlabel('Epochs')
plt.ylabel('Loss')
plt.title('Training Loss over Epochs')
plt.legend()
plt.grid(True)
plt.show()""")

add_markdown("## 7. Model Evaluation\nCalculate the final accuracy of the model on unseen test data.")

add_code("""model.eval()
correct = 0
total = 0

print("Starting Evaluation...")
with torch.no_grad():
    for images, labels in test_loader:
        images = images.to(device)
        labels = labels.to(device).float().unsqueeze(1)
        
        outputs = model(images)
        # Since we use raw logits, a prediction > 0 is equivalent to a probability > 0.5
        preds = (outputs > 0.0).float() 
        
        correct += (preds == labels).sum().item()
        total += labels.size(0)

accuracy = correct / total
print(f"Test Accuracy: {accuracy:.4f}")""")

add_markdown("## 8. Inference Visualization\nLet's look at some individual predictions visually!")

add_code("""# Visualize predictions on a few test images
dataiter = iter(test_loader)
images, labels = next(dataiter)
images, labels = images.to(device), labels.to(device).float().unsqueeze(1)

outputs = model(images)
preds = (outputs > 0.0).float()

images = images.cpu()
labels = labels.cpu()
preds = preds.cpu()

fig = plt.figure(figsize=(15, 6))
for idx in range(8):
    ax = fig.add_subplot(2, 4, idx+1, xticks=[], yticks=[])
    img = images[idx] / 2 + 0.5 # unnormalize
    npimg = img.numpy()
    plt.imshow(np.transpose(npimg, (1, 2, 0)))
    
    true_label = dataset.classes[int(labels[idx].item())]
    pred_label = dataset.classes[int(preds[idx].item())]
    
    ax.set_title(f"True: {true_label}\\nPred: {pred_label}", 
                 color=("green" if true_label == pred_label else "red"))

plt.tight_layout()
plt.show()""")

with open('updated_notebook.ipynb', 'w') as f:
    json.dump(notebook, f, indent=2)

print("Created updated_notebook.ipynb successfully!")
