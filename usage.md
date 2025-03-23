# FortiCore Usage Guide

## Overview

FortiCore is a comprehensive penetration testing framework designed to simplify security assessments. It offers multiple scanning modules for various security testing needs, including port scanning, vulnerability detection, subdomain enumeration, Active Directory analysis, and database security testing.

## Basic Usage

After installation, FortiCore can be accessed using the `ftcore` command:

```bash
ftcore
```

This launches the interactive command-line interface with the following prompt:

```
ftcore>
```

## Available Commands

| Command                             | Description                        | Example                                      |
| ----------------------------------- | ---------------------------------- | -------------------------------------------- |
| `help`                              | Display help information           | `ftcore> help`                               |
| `scan <target>`                     | Run a comprehensive scan           | `ftcore> scan example.com`                   |
| `portscan <target> [type] [format]` | Scan ports on a target             | `ftcore> portscan example.com comprehensive` |
| `subdomain <domain>`                | Enumerate subdomains               | `ftcore> subdomain example.com`              |
| `--d <target>`                      | Scan for database vulnerabilities  | `ftcore> --d example.com?id=1`               |
| `-dt <target>`                      | Detect technologies used by target | `ftcore> -dt example.com`                    |
| `ad <domain> [user] [pass]`         | Scan Active Directory              | `ftcore> ad company.local`                   |
| `clear`                             | Clear the terminal screen          | `ftcore> clear`                              |
| `version`                           | Show FortiCore version             | `ftcore> version`                            |
| `exit`                              | Exit FortiCore                     | `ftcore> exit`                               |

## Module Details

### Port Scanner

The enhanced port scanner module provides detailed information about open ports, services, and potential vulnerabilities.

```bash
ftcore> portscan <target> [scan_type] [report_format]
```

Available scan types:

- `quick` - Fast scan of top 100 ports
- `comprehensive` (default) - Full scan with service detection and vulnerability checking
- `stealth` - Low and slow scan designed to avoid detection

Available report formats:

- `html` (default) - Create HTML report
- `json` - Create JSON report
- `yaml` - Create YAML report

Example:

```bash
ftcore> portscan example.com comprehensive html
```

### Subdomain Scanner

The subdomain scanner enumerates and validates subdomains for a given domain.

```bash
ftcore> subdomain <domain> [report_format]
```

Example:

```bash
ftcore> subdomain example.com
```

### Vulnerability Scanner

The technology detection module identifies web technologies and checks for related vulnerabilities.

```bash
ftcore> -dt <target> [report_format]
```

Example:

```bash
ftcore> -dt example.com
```

### Active Directory Scanner

The AD scanner module collects information from Active Directory environments.

```bash
ftcore> ad <domain> [username] [password]
```

Example:

```bash
ftcore> ad company.local admin Password123
```

If credentials are not provided, the scanner will attempt to perform basic reconnaissance without authentication.

### Database Scanner

The database scanner checks for SQL injection vulnerabilities.

```bash
ftcore> --d <parameterized_url>
```

Example:

```bash
ftcore> --d example.com?id=1
```

## Report Generation

All FortiCore modules automatically generate reports. By default, reports are saved in the `scans/<target>/` directory with the following formats:

- HTML reports (default) - Detailed, interactive reports
- JSON reports - Machine-readable data format
- YAML reports - Human-readable data format

## Scan Results

After a scan completes, FortiCore provides:

1. Summary of findings in the terminal
2. Path to detailed reports
3. Statistics on scan coverage
4. Highlighted potential security issues

## Advanced Usage

### Comprehensive Scanning

To perform a full assessment, use the `scan` command which combines multiple modules:

```bash
ftcore> scan example.com
```

This runs port scanning, subdomain enumeration, and vulnerability detection in sequence.

### Customizing Scans

You can customize scan parameters by specifying additional arguments:

```bash
ftcore> portscan example.com stealth yaml
```

This performs a stealthy port scan and generates a YAML report.

## Troubleshooting

If you encounter issues with FortiCore:

1. Ensure all dependencies are installed (run `pip install -r requirements.txt`)
2. Verify you have necessary permissions for scanning
3. Check connectivity to target systems
4. Review logs in the FortiCore installation directory
