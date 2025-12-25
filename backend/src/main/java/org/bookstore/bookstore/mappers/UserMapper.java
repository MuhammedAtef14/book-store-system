package org.bookstore.bookstore.mappers;


import org.bookstore.bookstore.dtos.UserDto;
import org.bookstore.bookstore.entities.User;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(source = "role", target = "userRole")
    UserDto toDto(User user);

    @Mapping(source = "userRole", target = "role")
    User toEntity(UserDto userDto);

    @BeanMapping(nullValuePropertyMappingStrategy =
            org.mapstruct.NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "userId", ignore = true)
    @Mapping(source = "userRole", target = "role")
    void updateUser(UserDto userDto, @MappingTarget User user);

}
