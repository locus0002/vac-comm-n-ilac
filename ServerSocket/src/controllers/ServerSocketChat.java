/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package controllers;

import java.io.EOFException;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.net.ServerSocket;
import java.net.Socket;

/**
 *
 * @author Vladimir Aca
 */
public class ServerSocketChat {
    
    private ObjectOutputStream output;
    private ObjectInputStream input;
    private ServerSocket server;
    private Socket connection;
    private int counter;
    
    public ServerSocketChat() {
        
    }

    public void executeServer(){
        
        try {
            server = new ServerSocket(12345, 10);
            while(true){
                try {
                    waitConnection();
                    getStreams();
                    proccessConnection();
                } catch (EOFException exEOFE) {
                    showMessage("The connection was finished\n");
                }finally{
                    closeConnection();
                    counter++;
                }
            }
        } catch (IOException exIOE) {
            exIOE.printStackTrace();
        }
    }

    private void waitConnection() throws IOException{
        showMessage("Waiting connection\n");
        connection = server.accept();
        showMessage("Connection from: " + connection.getInetAddress().getHostName() );
    }

    private void proccessConnection() throws IOException{
        String msg = "Successful connection";
        sendData(msg);
        do{
            try {
                msg = (String) input.readObject();
                showMessage("\n" + msg);
            } catch (ClassNotFoundException exClassNotFoundException) {
                showMessage("Type of object do not supported");
            }
        }while(!msg.equals("CLIENT>> FINISH"));
    }

    private void getStreams() throws IOException{
        output = new ObjectOutputStream(connection.getOutputStream());
        output.flush();
        
        input = new ObjectInputStream(connection.getInputStream());
        showMessage("got the streams");
    }

    private void closeConnection() {
        showMessage("Finished connection");
        try {
            input.close();
            output.close();
            connection.close();
        } catch (IOException exIOE) {
            showMessage("\nError to process message");
        }
    }

    private void showMessage(String message) {
        System.out.println("Message: " + message);
    }

    private void sendData(String msg) {
        try {
            output.writeObject("Servidor>> " + msg);
            output.flush();
            showMessage("Servidor>> " + msg);
        } catch (IOException exIOE) {
            showMessage("Error to write in object");
        }
    }
    
    
}
