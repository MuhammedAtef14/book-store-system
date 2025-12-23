package org.bookstore.bookstore.entities;


import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class Message {
    private String body;
    private String subject;

    public Message(String body,String subject)
    {
        this.body=body;
        this.subject=subject;
    }
}
