package com.app.starter1.dto;

import lombok.*;

import java.time.LocalDate;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CustomerDTO {
    private Long id;
    private String name;
    private String nit;
    private String phone;
    private String email;
    private String address;
    private String contact;
    private String position;
    private String type;
    private Boolean status;
    private LocalDate dateRegister;


    // Getters y setters aquí
}
