# Backend Testing Guide

## Running Tests

```bash
# Run all tests
mvn test

# Run tests with coverage
mvn test jacoco:report

# Run specific test class
mvn test -Dtest=ReservaServiceTest

# Skip tests during build
mvn clean install -DskipTests
```

## Test Coverage

After running `mvn test jacoco:report`, open `target/site/jacoco/index.html` in your browser to view the coverage report.

## Test Structure

- `src/test/java/com/project_sgc_ultimate/service/` - Unit tests for services
- `src/test/java/com/project_sgc_ultimate/controller/` - Integration tests for controllers
- `src/test/java/com/project_sgc_ultimate/repository/` - Repository tests

## Writing Tests

### Unit Test Example:

```java
@ExtendWith(MockitoExtension.class)
class MyServiceTest {
    @Mock
    private MyRepository repository;
    
    @InjectMocks
    private MyService service;
    
    @Test
    void testMethod() {
        // Arrange
        when(repository.findById("id")).thenReturn(Optional.of(entity));
        
        // Act
        Result result = service.method("id");
        
        // Assert
        assertNotNull(result);
        verify(repository, times(1)).findById("id");
    }
}
```

### Integration Test Example:

```java
@SpringBootTest
@AutoConfigureMockMvc
class MyControllerTest {
    @Autowired
    private MockMvc mockMvc;
    
    @Test
    @WithMockUser(roles = "ADMIN")
    void testEndpoint() throws Exception {
        mockMvc.perform(get("/api/endpoint"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }
}
```

## Best Practices

1. **Use descriptive test names**: `testCrearReserva_WhenCanchaNotAvailable_ThrowsException`
2. **Follow AAA pattern**: Arrange, Act, Assert
3. **Mock external dependencies**: Use @Mock for repositories and external services
4. **Test edge cases**: null values, empty lists, invalid data
5. **Maintain high coverage**: Aim for 80%+ code coverage
