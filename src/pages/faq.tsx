import { Link } from 'react-router-dom';
import { ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface FaqItemProps {
  question: string;
  answer: React.ReactNode;
}

const FaqItem = ({ question, answer }: FaqItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border-b border-border last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full py-6 px-4 text-left hover:bg-purple-500/5 transition-colors duration-200 rounded-lg"
      >
        <h3 className="text-lg font-medium">{question}</h3>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-5 w-5 text-muted-foreground" />
        )}
      </button>
      <div 
        className={cn(
          "overflow-hidden transition-all duration-300",
          isOpen ? "max-h-96 px-4 pb-6" : "max-h-0"
        )}
      >
        <div className={cn(isOpen ? "animate-fade-in" : "invisible")}>{answer}</div>
      </div>
    </div>
  );
};

const FAQ = () => {
  return (
    <div className="max-w-3xl mx-auto px-4">
      <div className="mb-12 animate-slide-up">
        <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
        <p className="text-xl text-muted-foreground mb-6">
          Find answers to common questions about FortiCore.
        </p>
        
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                Home
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                <span className="ml-1 text-sm font-medium text-foreground">FAQ</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>
      
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-8">General Questions</h2>
        
        <div className="glass-card divide-y divide-border rounded-xl overflow-hidden">
          <FaqItem 
            question="What is FortiCore?" 
            answer={
              <p>
                FortiCore is an automated Penetration Testing Tool (PTT) designed to simplify security testing processes. It helps organizations identify vulnerabilities in their systems, applications, and networks through automated scanning and safe exploitation techniques.
              </p>
            } 
          />
          
          <FaqItem 
            question="Is FortiCore suitable for beginners?" 
            answer={
              <p>
                Yes, FortiCore is designed with both beginners and experts in mind. The command-line interface includes guided wizards and comprehensive help commands. The detailed documentation and clear reporting make it accessible for users with limited cybersecurity expertise.
              </p>
            } 
          />
          
          <FaqItem 
            question="Which platforms does FortiCore support?" 
            answer={
              <p>
                FortiCore currently primarily supports Linux systems, as it's the most standard platform for penetration testing. However, you can use FortiCore on other platforms through Docker. Windows and macOS native support is planned for future releases.
              </p>
            } 
          />
          
          <FaqItem 
            question="Is FortiCore free to use?" 
            answer={
              <p>
                FortiCore offers both free and premium versions. The free version includes basic vulnerability scanning capabilities, while the premium version adds advanced features like comprehensive reporting, integration options, and priority support. Check our website for current pricing details.
              </p>
            } 
          />
        </div>
      </section>
      
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-6">Installation & Configuration</h2>
        
        <div className="glass-card divide-y divide-border">
          <FaqItem 
            question="How do I update FortiCore to the latest version?" 
            answer={
              <div>
                <p className="mb-2">To update FortiCore to the latest version, use the built-in update command:</p>
                <pre className="bg-primary/5 p-3 rounded-md overflow-x-auto">
                  <code>forticore update</code>
                </pre>
                <p className="mt-2">You can also enable automatic updates in the configuration file by setting <code className="bg-primary/10 px-1.5 py-0.5 rounded text-primary">auto_update: true</code> in the general section.</p>
              </div>
            } 
          />
          
          <FaqItem 
            question="Where are scan results stored?" 
            answer={
              <p>
                By default, FortiCore stores scan results in the <code className="bg-primary/10 px-1.5 py-0.5 rounded text-primary">~/forticore-reports</code> directory. You can customize this location by modifying the <code className="bg-primary/10 px-1.5 py-0.5 rounded text-primary">output_dir</code> setting in your configuration file or using the <code className="bg-primary/10 px-1.5 py-0.5 rounded text-primary">--output-dir</code> command-line argument.
              </p>
            } 
          />
          
          <FaqItem 
            question="How do I configure FortiCore to use a proxy?" 
            answer={
              <div>
                <p className="mb-2">You can configure FortiCore to use a proxy in several ways:</p>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>Using an environment variable: <code className="bg-primary/10 px-1.5 py-0.5 rounded text-primary">export FORTICORE_PROXY="http://proxy.example.com:8080"</code></li>
                  <li>In the configuration file:
                    <pre className="bg-primary/5 p-3 rounded-md overflow-x-auto mt-2">
                      <code>
                        network:<br />
                        &nbsp;&nbsp;proxy: "http://proxy.example.com:8080"
                      </code>
                    </pre>
                  </li>
                  <li>Via command-line argument: <code className="bg-primary/10 px-1.5 py-0.5 rounded text-primary">--proxy http://proxy.example.com:8080</code></li>
                </ol>
              </div>
            } 
          />
          
          <FaqItem 
            question="Can I run FortiCore without internet access?" 
            answer={
              <p>
                Yes, FortiCore can operate in offline mode, though some features like vulnerability database updates will not be available. Use the <code className="bg-primary/10 px-1.5 py-0.5 rounded text-primary">--offline</code> flag to prevent FortiCore from attempting to connect to the internet for updates or additional information.
              </p>
            } 
          />
        </div>
      </section>
      
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-6">Scanning & Features</h2>
        
        <div className="glass-card divide-y divide-border">
          <FaqItem 
            question="Is FortiCore scanning safe for production environments?" 
            answer={
              <p>
                FortiCore is designed with safety in mind, but we recommend caution when scanning production environments. The default scan settings are non-intrusive, but intensive scans or exploitation attempts could potentially impact system performance or stability. We recommend testing in a staging environment first or running scans during low-traffic periods.
              </p>
            } 
          />
          
          <FaqItem 
            question="How long does a typical scan take?" 
            answer={
              <p>
                Scan duration depends on several factors, including the target size, scan type, and selected intensity. A basic web application scan might take 5-10 minutes, while a comprehensive network scan could take hours for large networks. You can control scan duration using the <code className="bg-primary/10 px-1.5 py-0.5 rounded text-primary">--intensity</code> and <code className="bg-primary/10 px-1.5 py-0.5 rounded text-primary">--timeout</code> parameters.
              </p>
            } 
          />
          
          <FaqItem 
            question="Can FortiCore scan behind authentication?" 
            answer={
              <div>
                <p className="mb-2">Yes, FortiCore supports various authentication methods:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Basic authentication: <code className="bg-primary/10 px-1.5 py-0.5 rounded text-primary">ftcore scan &lt;target&gt; --auth basic --username user --password pass</code></li>
                  <li>Token-based authentication: <code className="bg-primary/10 px-1.5 py-0.5 rounded text-primary">ftcore scan &lt;target&gt; --auth bearer --token &lt;token&gt;</code></li>
                  <li>Cookie-based authentication: <code className="bg-primary/10 px-1.5 py-0.5 rounded text-primary">ftcore scan &lt;target&gt; --auth cookie --cookie "session=abc123"</code></li>
                </ul>
              </div>
            } 
          />
          
          <FaqItem 
            question="How accurate are FortiCore's findings?" 
            answer={
              <p>
                FortiCore strives for high accuracy with minimal false positives. However, automated scanning has inherent limitations. FortiCore uses multiple validation techniques to reduce false positives, and findings are categorized by confidence level. For critical systems, we recommend expert review of scan results. The tool is continuously improved based on user feedback to enhance accuracy.
              </p>
            } 
          />
        </div>
      </section>
      
      <section className="mb-4">
        <h2 className="text-2xl font-bold mb-6">Troubleshooting</h2>
        
        <div className="glass-card divide-y divide-border">
          <FaqItem 
            question="FortiCore crashes during scanning. What should I do?" 
            answer={
              <div>
                <p className="mb-2">If FortiCore crashes during scanning, try these troubleshooting steps:</p>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>Update to the latest version of FortiCore</li>
                  <li>Run with increased logging: <code className="bg-primary/10 px-1.5 py-0.5 rounded text-primary">forticore scan --target example.com --log-level debug</code></li>
                  <li>Check system resources (memory, CPU) during the scan</li>
                  <li>Try reducing scan intensity: <code className="bg-primary/10 px-1.5 py-0.5 rounded text-primary">--intensity low</code></li>
                  <li>Scan specific modules instead of running comprehensive scans</li>
                </ol>
                <p className="mt-2">If the issue persists, please <a href="https://forticore.io/support" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">contact our support team</a> with the debug logs.</p>
              </div>
            } 
          />
          
          <FaqItem 
            question="I'm getting many false positives. How can I improve results?" 
            answer={
              <div>
                <p className="mb-2">To reduce false positives in your scan results:</p>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>Update to the latest version for improved detection algorithms</li>
                  <li>Use the <code className="bg-primary/10 px-1.5 py-0.5 rounded text-primary">--validate</code> flag for additional validation checks</li>
                  <li>Adjust confidence thresholds: <code className="bg-primary/10 px-1.5 py-0.5 rounded text-primary">--min-confidence medium</code></li>
                  <li>Create custom scan profiles that exclude problematic checks</li>
                  <li>Provide proper authentication to allow deeper scans</li>
                </ol>
              </div>
            } 
          />
          
          <FaqItem 
            question="How can I get support if I have issues with FortiCore?" 
            answer={
              <div>
                <p className="mb-2">For support with FortiCore, you have several options:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Check this documentation and FAQ section for answers</li>
                  <li>Visit our <a href="https://community.forticore.io" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">community forums</a></li>
                  <li>Open an issue on our <a href="https://github.com/forticore-team/forticore/issues" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">GitHub repository</a></li>
                  <li>Email our support team at <a href="mailto:support@forticore.io" className="text-primary hover:underline">support@forticore.io</a></li>
                  <li>Premium users can access priority support through the customer portal</li>
                </ul>
              </div>
            } 
          />
        </div>
      </section>
      
      <div className="mt-10 text-center text-muted-foreground">
        <p>Can't find the answer you're looking for?</p>
        <p className="mt-2">
          <a href="mailto:support@forticore.io" className="text-primary hover:underline">Contact our support team</a>
        </p>
      </div>
    </div>
  );
};

export default FAQ;
