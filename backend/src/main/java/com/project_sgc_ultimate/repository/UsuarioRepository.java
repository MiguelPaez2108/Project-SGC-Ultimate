package com.project_sgc_ultimate.repository;

import com.project_sgc_ultimate.model.Usuario;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends MongoRepository<Usuario, String> {

    Optional<Usuario> findByEmailIgnoreCase(String email);
}
