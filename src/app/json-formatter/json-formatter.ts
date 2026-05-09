import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-json-formatter',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './json-formatter.html',
  styleUrls: ['./json-formatter.scss']
})
export class JsonFormatter {
  jsonInput: string = '';
  formattedJson: string = '';
  statusMessage: string = '';

  formatJson() {
    this.statusMessage = '';

    try {
      const parsed = JSON.parse(this.jsonInput);
      const prettyJson = JSON.stringify(parsed, null, 2);
      this.formattedJson = this.syntaxHighlight(prettyJson);
      this.statusMessage = '✅ JSON formatted successfully';
    } catch (e: any) {
      this.formattedJson = '';
      this.statusMessage = `❌ ${e.message}`;
    }
  }

  validateJson() {
    this.statusMessage = '';

    try {
      JSON.parse(this.jsonInput);
      this.statusMessage = '✅ Valid JSON';
    } catch (e: any) {
      this.statusMessage = `❌ ${e.message}`;
    }
  }

  clearAll() {
    this.jsonInput = '';
    this.formattedJson = '';
    this.statusMessage = '';
  }

  copyToClipboard(text: string) {
    if (!text) {
      this.statusMessage = 'Nothing to copy';
      return;
    }

    navigator.clipboard.writeText(text.replace(/<[^>]*>/g, ''))
      .then(() => {
        this.statusMessage = '✅ Copied to clipboard';
        setTimeout(() => this.statusMessage = '', 2000);
      })
      .catch(() => {
        this.statusMessage = '❌ Copy failed';
      });
  }

 

  downloadJson() {
    if (!this.formattedJson) return;

    const cleanText = this.formattedJson.replace(/<[^>]*>/g, '');

    const blob = new Blob([cleanText], {
      type: 'application/json'
    });

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'formatted.json';
    a.click();

    window.URL.revokeObjectURL(url);
  }

  syntaxHighlight(json: string) {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    return json.replace(
      /("(\\u[\da-fA-F]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
      (match) => {
        let cls = 'number';

        if (/^"/.test(match)) {
          cls = /:$/.test(match) ? 'key' : 'string';
        } else if (/true|false/.test(match)) {
          cls = 'boolean';
        } else if (/null/.test(match)) {
          cls = 'null';
        }

        return `<span class="${cls}">${match}</span>`;
      }
    );
  }
}