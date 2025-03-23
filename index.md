# FortiCore Documentation

## Introduction

FortiCore is a comprehensive penetration testing framework designed for security professionals, penetration testers, and system administrators. It provides an integrated suite of tools for scanning, analyzing, and reporting security vulnerabilities across various attack surfaces.

With its modular architecture and extensible design, FortiCore offers a powerful yet user-friendly command-line interface to orchestrate security assessments and vulnerability discovery.

## Key Features

- **Comprehensive Port Scanning**: Fast and accurate port scanning with service detection, OS fingerprinting, and vulnerability identification
- **Subdomain Enumeration**: Discover subdomains using multiple techniques including DNS enumeration, certificate transparency, and brute forcing
- **Vulnerability Assessment**: Detect web technologies and identify associated vulnerabilities
- **Active Directory Analysis**: Assess Active Directory environments for security weaknesses
- **Database Security Testing**: Identify SQL injection vulnerabilities and database misconfigurations
- **Detailed Reporting**: Generate professional reports in multiple formats (HTML, JSON, YAML)
- **Modular Architecture**: Easily extend functionality with custom modules

## Documentation Structure

This documentation is organized into the following sections:

1. [Installation Guide](installation.md) - Instructions for installing and configuring FortiCore
2. [Usage Guide](usage.md) - Basic and advanced usage of FortiCore commands
3. [Module Documentation](modules.md) - Detailed information about each FortiCore module
4. [Architecture Overview](architecture.md) - Technical architecture and system design information

## Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/forticore/forticore.git

# Navigate to the FortiCore directory
cd forticore

# Run the installation script
sudo ./install.sh
```

### Basic Usage

After installation, you can access FortiCore using the `ftcore` command:

```bash
ftcore
```

This will start the interactive shell. Type `help` to see available commands:

```
ftcore> help
```

To perform a comprehensive scan on a target:

```
ftcore> scan example.com
```

## Use Cases

FortiCore is designed to support various security testing scenarios:

### Web Application Security Assessment

Scan web applications for vulnerabilities including open ports, exposed services, and web-specific issues:

```
ftcore> scan example.com
ftcore> -dt example.com
```

### Network Infrastructure Testing

Assess network infrastructure by identifying open ports, running services, and potential vulnerabilities:

```
ftcore> portscan example.com comprehensive
```

### Active Directory Security Assessment

Analyze Active Directory environments for security misconfigurations and potential attack paths:

```
ftcore> ad company.local [username] [password]
```

### Database Security Testing

Test for SQL injection vulnerabilities and database security issues:

```
ftcore> --d example.com?id=1
```

## Support and Contribution

FortiCore is an open source project that welcomes contributions and feedback. If you encounter issues or have suggestions for improvement, please open an issue on the GitHub repository.

## License

FortiCore is released under the MIT License. See the LICENSE file for details.
