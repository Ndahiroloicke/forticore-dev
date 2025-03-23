# FortiCore Installation Guide

## System Requirements

FortiCore is designed to run on Linux systems and requires:

- Python 3.6 or higher
- Root privileges (for certain scanning operations)
- At least 2GB of RAM
- 5GB of free disk space
- Network connectivity for tool installation and updates

## Installation Methods

### 1. Automatic Installation (Recommended)

The easiest way to install FortiCore is using the provided installation script:

```bash
# Clone the repository
git clone https://github.com/FORTI-CORE/forticore.git

# Navigate to the FortiCore directory
cd forticore

# Make the installation script executable
chmod +x install.sh

# Run the installation script with root privileges
sudo ./install.sh or
sudo bash install.sh
```

The installation script will:

- Install all required system dependencies
- Set up Python virtual environment
- Install Python package dependencies
- Configure tool paths and environment variables
- Install complementary security tools

### 2. Manual Installation

If you prefer to install FortiCore manually:

1. Install system dependencies:

```bash
sudo apt-get update
sudo apt-get install -y python3 python3-venv python3-dev python3-pip git libssl-dev libffi-dev nmap sqlmap figlet dirb nikto dnsmap hashcat hydra john netcat-openbsd zenmap sublist3r whatweb wafw00f neo4j openjdk-11-jdk
```

2. Install optional tools:

```bash
sudo apt-get install -y golang ruby-full nodejs npm
```

3. Clone the repository:

```bash
git clone https://github.com/forticore/forticore.git
cd forticore
```

4. Create and activate a virtual environment:

```bash
python3 -m venv venv
source venv/bin/activate
```

5. Install Python dependencies:

```bash
pip install --upgrade pip wheel setuptools
pip install -r requirements.txt
pip install -e .
```

6. Install additional security tools:

```bash
# Go tools
go install -v github.com/OWASP/Amass/v3/...@latest
go install -v github.com/projectdiscovery/subfinder/v2/cmd/subfinder@latest
go install -v github.com/projectdiscovery/nuclei/v2/cmd/nuclei@latest

# Nuclei templates
git clone https://github.com/projectdiscovery/nuclei-templates.git ~/nuclei-templates
nuclei -update-templates

# BloodHound Python
pip install bloodhound
```

## Verifying Installation

After installation is complete, verify FortiCore is working correctly:

```bash
# Activate the virtual environment if not already activated
source /opt/forticore/venv/bin/activate  # If using automatic installation
# OR
source venv/bin/activate  # If using manual installation

# Test the FortiCore command
ftcore version
```

If the installation was successful, you should see the FortiCore version information displayed.

## Troubleshooting Installation

If you encounter issues during installation:

### Common Problems

1. **Missing dependencies**:
   Ensure all system dependencies are installed with:

   ```bash
   sudo apt-get update
   sudo apt-get install -y python3 python3-venv python3-dev python3-pip git libssl-dev libffi-dev nmap
   ```

2. **Permission issues**:
   Make sure you're running the installation script with root privileges:

   ```bash
   sudo ./install.sh
   ```

3. **Python path issues**:
   If you receive import errors, verify the Python path:

   ```bash
   cd /opt/forticore
   pip install -e .
   ```

4. **Tool unavailability**:
   If certain tools are missing, you can install them manually:
   ```bash
   sudo apt-get install -y nmap sqlmap dirb nikto
   ```

## Post-Installation Configuration

### 1. Update Nuclei Templates

For the latest vulnerability templates:

```bash
nuclei -update-templates
```

### 2. Configure BloodHound (Optional)

If you plan to use Active Directory scanning features:

```bash
# Start Neo4j service
sudo systemctl start neo4j

# Set Neo4j password
curl -H "Content-Type: application/json" -X POST -d '{"password":"bloodhound"}' -u neo4j:neo4j http://localhost:7474/user/neo4j/password

# Launch BloodHound
bloodhound
```

### 3. Setting Up Report Templates

FortiCore automatically installs default report templates, but you can customize them:

```bash
cd /opt/forticore/forticore/utils/templates
# Edit the templates as needed
```

## Updating FortiCore

To update FortiCore to the latest version:

```bash
cd /opt/forticore
git pull
source venv/bin/activate
pip install -r requirements.txt
pip install -e .
```

## Uninstalling FortiCore

If you need to uninstall FortiCore:

```bash
sudo rm -rf /opt/forticore
sudo rm /usr/local/bin/ftcore
```

## Next Steps

After installation, refer to the [FortiCore Usage Guide](usage.md) to learn how to use the framework for security testing.
