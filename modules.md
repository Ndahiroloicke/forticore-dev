# FortiCore Modules Documentation

FortiCore is organized into several modules, each focused on a specific area of penetration testing. This document provides technical details about each module and its capabilities.

## Core Architecture

The FortiCore framework is built on a modular architecture with the following key components:

- **CLI Interface**: Provides command parsing and user interaction
- **Scanner Base**: Common functionality shared by all scanning modules
- **Module Ecosystem**: Specialized scanning and assessment modules
- **Reporting System**: Standardized report generation
- **Utility Services**: Shared functions and helpers

## Website Module

The website module handles web-based scanning and assessment.

### Port Scanner

**File Path**: `forticore/modules/website/port_scanner.py`

The enhanced port scanner identifies open network ports, services, and potential vulnerabilities on target systems.

**Features**:

- Multiple scan types (quick, comprehensive, stealth)
- Service version detection and fingerprinting
- OS detection using TCP/IP stack analysis
- Vulnerability identification using nmap scripts
- Detailed reporting with severity classification

**Technical Implementation**:

- Uses `python-nmap` for network scanning
- Employs parallel processing for faster scans
- Includes intelligent timeout handling
- Customizable scan parameters

**Scan Types**:

1. **Quick Scan**:

   - Scans top 100 common ports
   - Uses aggressive timing templates
   - Optimized for speed over stealth
   - Command: `portscan <target> quick`

2. **Comprehensive Scan**:

   - Scans all 65,535 TCP ports
   - Full service version detection
   - OS fingerprinting
   - Vulnerability script execution
   - Command: `portscan <target> comprehensive`

3. **Stealth Scan**:
   - Lower packet rate
   - Randomized target port order
   - Minimal connection attempts
   - Designed to evade intrusion detection systems
   - Command: `portscan <target> stealth`

### Subdomain Scanner

**File Path**: `forticore/modules/website/subdomain.py`

Discovers and validates subdomains associated with a target domain.

**Features**:

- Multiple enumeration techniques
- Active and passive discovery methods
- DNS record validation
- Web server verification
- Geographic IP mapping

**Technical Implementation**:

- Uses DNS zone transfers when available
- Performs dictionary-based brute forcing
- Leverages public certificate transparency logs
- Integrates with external APIs for passive reconnaissance

**Usage Example**:

```bash
ftcore> subdomain example.com
```

### Vulnerability Scanner

**File Path**: `forticore/modules/website/vulnscan.py`

Detects technologies in use and identifies associated vulnerabilities.

**Features**:

- Web technology fingerprinting
- Known vulnerability matching
- CVE correlation
- Risk severity assessment
- Remediation recommendations

**Technical Implementation**:

- Integrates with Nuclei for template-based scanning
- Performs header and response analysis
- Checks for outdated software versions
- Identifies misconfigurations

**Usage Example**:

```bash
ftcore> -dt example.com
```

### AD Scanner

**File Path**: `forticore/modules/website/ad_scanner.py`

Analyzes Active Directory environments for security issues.

**Features**:

- Domain controller enumeration
- User and group enumeration
- Trust relationship mapping
- Privilege escalation path identification
- Misconfigurations detection

**Technical Implementation**:

- Integrates with BloodHound
- Performs LDAP queries
- Maps domain relationships
- Identifies security misconfigurations

**Authentication Modes**:

- Unauthenticated (limited information)
- Authenticated (comprehensive assessment)

**Usage Example**:

```bash
ftcore> ad domain.local [username] [password]
```

## Database Module

**File Path**: `forticore/modules/database`

The database module focuses on database security assessment.

**Features**:

- SQL injection detection
- Database enumeration
- Privilege escalation testing
- Data exfiltration assessment

**Technical Implementation**:

- Integrates with SQLMap
- Performs parameter analysis
- Tests for various SQL injection techniques
- Assesses database security configurations

**Usage Example**:

```bash
ftcore> --d example.com?id=1
```

## Utils Module

The utils module provides shared utility functions for the framework.

### Report Generator

**File Path**: `forticore/utils/report_generator.py`

Handles the creation of standardized reports in multiple formats.

**Features**:

- Multiple output formats (HTML, JSON, YAML)
- Consistent styling and branding
- Interactive HTML reports
- Machine-readable data structures

**Report Types**:

- Port scan reports
- Vulnerability assessment reports
- Subdomain enumeration reports
- AD analysis reports
- Database assessment reports

**Templates**:

- Located in `forticore/utils/templates/`
- Uses Jinja2 templating engine
- Customizable through HTML/CSS editing

### Logger

**File Path**: `forticore/utils/logger.py`

Provides consistent logging functionality across the framework.

**Features**:

- Color-coded console output
- Log file rotation
- Severity levels
- Timestamp formatting
- Detailed error tracking

## CLI Module

**File Path**: `forticore/cli/`

Handles user interaction through the command-line interface.

### Command Handler

**File Path**: `forticore/cli/commands.py`

Processes user commands and routes them to appropriate modules.

**Features**:

- Command parsing and validation
- Help information
- Error handling
- Status reporting

### Terminal Interface

**File Path**: `forticore/cli/terminal.py`

Manages the interactive terminal environment.

**Features**:

- Command history
- Tab completion
- Colorized output
- Interactive user experience

## Core Module

**File Path**: `forticore/core/`

Contains base classes and fundamental functionality.

### Base Scanner

**File Path**: `forticore/core/scanner.py`

Provides common functionality for all scanner modules.

**Features**:

- Standardized initialization
- Output directory management
- Tool availability checking
- Command execution wrapper
- Error handling

## Configuration

**File Path**: `forticore/config/`

Manages configuration settings for the framework.

**Features**:

- Default settings
- User configuration overrides
- Environment variable integration
- Tool path management
