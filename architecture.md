# FortiCore Architecture

## System Overview

FortiCore is a modular penetration testing framework designed with extensibility and ease of use in mind. The system follows a layered architecture where modules build upon a common core foundation.

```
+-------------------------------------------+
|                  CLI                      |
|       (Command Line Interface)            |
+-------------------------------------------+
                    |
+-------------------------------------------+
|               Core System                 |
|     (BaseScanner, Utils, Configs)         |
+-------------------------------------------+
        /        |        \         \
+----------+ +----------+ +----------+ +-----------+
| Website  | | Database | | Network  | | Reporting |
| Modules  | | Modules  | | Modules  | | System    |
+----------+ +----------+ +----------+ +-----------+
    / | \        |           |             |
  /   |   \      |           |             |
Port Subdom. Vuln. SQL      Traffic      Reports
Scan  Enum   Scan  Inj.     Analysis    Generation
```

## Architectural Components

### 1. Command Line Interface (CLI)

The CLI layer handles user interaction and command processing.

**Key Components:**

- **Terminal Handler**: Manages the terminal session and user input
- **Command Router**: Routes commands to appropriate modules
- **Help System**: Provides usage guidance
- **Error Handler**: Manages and reports errors

**Flow of Operation:**

```
User Input → Command Parsing → Validation → Module Invocation → Result Display
```

### 2. Core System

The core system provides fundamental functionality used by all modules.

**Key Components:**

- **BaseScanner**: Abstract base class for all scanning modules
- **Configuration Manager**: Handles application settings
- **Utility Services**: Common helper functions
- **Logging System**: Standardized logging

**Design Patterns:**

- Template Method (BaseScanner)
- Singleton (Config Manager)
- Factory (Report Generation)
- Strategy (Scanner Implementation)

### 3. Module Ecosystem

Modules are specialized components that perform specific security testing functions.

#### Website Modules

```
  +--------------------+
  |  Website Modules   |
  +--------------------+
           |
    +------+------+
    |             |
+--------+    +--------+    +--------+    +--------+
|  Port  |    |Subdomain|   |  Vuln  |    |   AD   |
|Scanner |    |Scanner  |   |Scanner |    |Scanner |
+--------+    +--------+    +--------+    +--------+
    |              |             |             |
    v              v             v             v
 Port/Svc    Subdomain      Vulnerability    Active
 Detection   Enumeration    Detection      Directory
                                           Analysis
```

#### Database Modules

```
  +--------------------+
  |  Database Modules  |
  +--------------------+
           |
    +------+------+
    |             |
+--------+    +--------+
|  SQL   |    |  NoSQL |
|Scanner |    |Scanner |
+--------+    +--------+
    |              |
    v              v
SQL Injection   MongoDB/Redis
  Testing        Assessment
```

### 4. Reporting System

The reporting system handles data collection, analysis and presentation.

```
  +--------------------+
  |  Reporting System  |
  +--------------------+
           |
    +------+------+-------+
    |      |      |       |
+--------+  |  +--------+ |
|Template|  |  |  Data  | |
| Engine |  |  |Formatter| |
+--------+  |  +--------+ |
    |       |      |      |
    v       v      v      v
  HTML     JSON   YAML   Charts
 Reports   Data   Data  Generation
```

## Component Interactions

### Scanner Execution Flow

```
┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐
│ Command │     │ Scanner │     │  Scan   │     │ Report  │
│ Input   │────>│ Init    │────>│ Execute │────>│ Generate│
└─────────┘     └─────────┘     └─────────┘     └─────────┘
                     │                │              │
                     v                v              v
                ┌─────────┐     ┌─────────┐    ┌─────────┐
                │ Config  │     │ Results │    │ Output  │
                │ Validate│     │ Process │    │ Display │
                └─────────┘     └─────────┘    └─────────┘
```

### Module Communication

Modules in FortiCore can operate independently or in coordinated sequences. The communication pattern follows a loosely coupled design where modules share data through standardized interfaces.

```
    Module A                 Module B
┌─────────────┐         ┌─────────────┐
│             │         │             │
│  Execute    │───┐     │  Receive    │
│  Scan       │   │     │  Results    │
│             │   └────>│             │
└─────────────┘         └─────────────┘
       │                       │
       v                       v
┌─────────────┐         ┌─────────────┐
│ Generate    │         │ Process &   │
│ Results     │         │ Extend      │
└─────────────┘         └─────────────┘
```

## Data Flow

### User Commands to Results

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  User    │    │  Command │    │  Module  │    │  Data    │    │  Report  │
│  Input   │───>│  Parser  │───>│ Execution│───>│ Analysis │───>│ Generator│
└──────────┘    └──────────┘    └──────────┘    └──────────┘    └──────────┘
                                      │               ▲
                                      v               │
                                 ┌──────────┐    ┌──────────┐
                                 │  Raw     │    │ Processed│
                                 │  Results │───>│  Results │
                                 └──────────┘    └──────────┘
```

### Reporting Data Flow

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  Scan    │    │  Results │    │ Template │    │  Final   │
│  Results │───>│ Processor│───>│  Engine  │───>│  Report  │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
                      │
                      v
                ┌──────────┐
                │  Data    │
                │  Store   │
                └──────────┘
```

## Extension Architecture

FortiCore is designed to be extensible through a plugin architecture:

```
┌─────────────────────────────────────────┐
│            FortiCore Core               │
└─────────────────────────────────────────┘
                   ▲
      ┌────────────┼────────────┐
      │            │            │
┌───────────┐ ┌───────────┐ ┌───────────┐
│  Built-in │ │  Custom   │ │  External │
│  Modules  │ │  Modules  │ │  Plugins  │
└───────────┘ └───────────┘ └───────────┘
```

### Creating Custom Modules

Custom modules can be developed by:

1. Inheriting from the BaseScanner class
2. Implementing required methods
3. Registering the module with the command handler

```python
class CustomScanner(BaseScanner):
    def __init__(self, target, output_dir=None):
        super().__init__(target, output_dir)

    def run(self):
        # Custom scanning logic
        return results
```

## Configuration Management

FortiCore uses a layered configuration approach:

```
┌─────────────────────┐
│  Default Settings   │
└─────────────────────┘
          ▲
          │
┌─────────────────────┐
│  User Config File   │
└─────────────────────┘
          ▲
          │
┌─────────────────────┐
│ Environment Vars    │
└─────────────────────┘
          ▲
          │
┌─────────────────────┐
│ Command Line Args   │
└─────────────────────┘
```

## Dependency Management

FortiCore manages dependencies in a modular fashion:

```
┌─────────────────────────┐
│    Python Core Libs     │
└─────────────────────────┘
            │
┌───────────┴───────────┐
│  FortiCore Required   │
│      Dependencies     │
└───────────┬───────────┘
            │
   ┌────────┴────────┐
   │                 │
┌──────────┐   ┌──────────┐
│ Module   │   │ Optional │
│ Specific │   │ Tools    │
└──────────┘   └──────────┘
```

## Deployment Diagram

FortiCore deployment in a typical environment:

```
┌───────────────────────────────────────────────────┐
│                  User's System                     │
│                                                   │
│  ┌─────────────┐      ┌─────────────────────┐    │
│  │ FortiCore   │◄────►│ Local Config & Data │    │
│  │ Framework   │      └─────────────────────┘    │
│  └─────────┬───┘                                  │
│            │                                      │
│  ┌─────────▼───────┐   ┌─────────────────────┐   │
│  │ External Tools  │   │ Report Output Files │   │
│  │ (nmap, etc.)    │   │                     │   │
│  └─────────────────┘   └─────────────────────┘   │
└───────────────────────────────────────────────────┘
              │
              ▼
┌───────────────────────────────────────────────────┐
│                  Target Systems                    │
│                                                   │
│  ┌─────────────┐      ┌─────────────────────┐    │
│  │ Web Servers │      │ Database Servers    │    │
│  └─────────────┘      └─────────────────────┘    │
│                                                   │
│  ┌─────────────┐      ┌─────────────────────┐    │
│  │ Active      │      │ Network             │    │
│  │ Directory   │      │ Infrastructure      │    │
│  └─────────────┘      └─────────────────────┘    │
└───────────────────────────────────────────────────┘
```

## Security Architecture

FortiCore implements security controls at various levels:

```
┌───────────────────────────────────────────────────┐
│               Security Controls                    │
├───────────────┬───────────────┬───────────────────┤
│ Input         │ Processing    │ Output            │
│ Validation    │ Controls      │ Sanitization      │
├───────────────┴───────────────┴───────────────────┤
│              Privilege Management                  │
├───────────────────────────────────────────────────┤
│              Secure Communication                  │
└───────────────────────────────────────────────────┘
```

## Performance Considerations

FortiCore optimizes performance through:

1. **Parallel Processing**: Multiple targets scanned simultaneously
2. **Resource Management**: Controlling resource usage during intensive scans
3. **Efficient Data Handling**: Minimizing memory usage for large datasets
4. **Caching**: Storing common results to avoid redundant operations

## Conclusion

The FortiCore architecture is designed with modularity, extensibility, and usability in mind. Components are loosely coupled yet work together seamlessly to provide a comprehensive security testing framework. This design allows for easy addition of new modules and features while maintaining a consistent user experience.
