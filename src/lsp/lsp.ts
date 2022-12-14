import {
  createConnection,
  //Diagnostic,
  //DidChangeConfigurationNotification,
  //InitializeParams,
  ProposedFeatures,
  //TextDocumentIdentifier,
  TextDocuments,
  //TextDocumentSyncKind,
} from "npm:vscode-languageserver/node.js";

import { TextDocument } from "npm:vscode-languageserver-textdocument";

export function runLspServer() {
  return new Promise((_resolve, reject) => {
    try {
      // Create a connection for the server. The connection uses Node's IPC as a transport.
      // Also include all preview / proposed LSP features.
      const connection = createConnection(ProposedFeatures.all);

      // Create a simple text document manager. The text document manager
      // supports full document sync only
      const documents: TextDocuments<TextDocument> = new TextDocuments(
        TextDocument,
      );

      // listen
      documents.listen(connection);

      connection.onInitialize(() => {
        return {
          capabilities: {
            textDocumentSync: {
              openClose: true,
              //change: TextDocumentSyncKind.None,
            },
          },
        };
      });

      // listen for connections
      connection.listen();
    } catch (error) {
      reject(error);
    }
  });
}

// keep a timer heartbeat going (without this the process will exit
// b/c there is nothing in the event queue)
setInterval(() => {}, 1000);

// run the server
await runLspServer();

// just to confirm we don't get here
console.log("exiting");
