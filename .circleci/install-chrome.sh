#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"

source ~/.bashrc

echo "Installing Chrome Browser"
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
sudo apt update && sudo google-chrome-stable_current_amd64.deb

