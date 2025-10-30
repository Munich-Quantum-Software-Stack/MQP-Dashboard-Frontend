import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ContentCard from "../../UI/Card/ContentCard";
import { getAuthToken } from "../../utils/auth";
import "./FAQ.scss";

const FAQ_DATA = {
    "Getting Started": [
        {
            q: "1. Prerequisites to get started on the MQP",
            a: (
                <div>
                    <a href="https://munich-quantum-software-stack.github.io/MQSS-Interfaces/" target="_blank" rel="noopener noreferrer">
                        MQSS Getting Started Guide
                    </a>
                    <br />
                    <a href="https://munich-quantum-software-stack.github.io/MQSS-Interfaces/qiskit/user_guide/getting_started/" target="_blank" rel="noopener noreferrer">
                        MQSS Qiskit Adapter
                    </a>
                    <br />
                    <a href="https://munich-quantum-software-stack.github.io/MQSS-Interfaces/pennylane/user_guide/getting_started/" target="_blank" rel="noopener noreferrer">
                        MQSS Pennylane Adapter
                    </a>
                    <br />
                    <a href="https://munich-quantum-software-stack.github.io/MQSS-Interfaces/cudaq/index.html" target="_blank" rel="noopener noreferrer">
                        MQSS CUDA-Q Adapter
                    </a>
                </div>
            )
        },
        {
            q: "2. I have a token—what should I do next?",
            a: (
                <div>
                    <p>After obtaining your token from Munich Quantum Portal, the next step is to install the one of the MQSS adapters.</p>
                    <p>Here we provide the example of MQSS Qiskit Adapter:</p>
                    <pre>pip install mqss-qiskit</pre>
                    <p>It is recommended to perform the installation in a new, clean Python environment without any existing Qiskit version to avoid dependency conflicts.</p>
                    <p>Once installed, you can initialize and use the adapter in your scripts as described in the <a href="https://munich-quantum-software-stack.github.io/MQSS-Interfaces/qiskit/user_guide/getting_started/#usage" target="_blank" rel="noopener noreferrer">Usage</a> section.</p>
                </div>
            )
        },
        {
            q: "3. What are the names or IDs of the available backends?",
            a: (
                <div>
                    <div>You can view the available backends either through the Munich Quantum Portal by going to the Resources tab or using the MQSS Qiskit Adapter as follows: </div>
                    <div>Having initialized the MQSS Qiskit Adapter with your token, you can list all the available backends to your account:</div>
                    <pre>all_backends = adapter.backends()<br />print("Available backends:", all_backends)</pre>
                    <div>To list all the online and accessible backends, run:</div>
                    <pre>all_online_backends = adapter.backends(online=True)<br />print("Available backends:", all_online_backends)</pre>
                </div>
            )
        },
        {
            q: "4. Where can I find the native gate sets for each device?",
            a: (
                <div>
                    <p>Retrieve the Qiskit backend's target object, which lists the native gates for each backend:</p>
                    <pre>backend = adapter.get_backend("&lt;resource-name&gt;")<br />print(backend.target)</pre>
                </div>
            )
        },
        {
            q: "5. Are there sample jobs or example notebooks to help me get started?",
            a: "Yes, some example scripts on this github link {}"
        }
    ],
    "Job Submission and Execution": [
        {
            q: "1. How do I submit a job or run a circuit?",
            a: (
                <div>
                    <p>It depends on which adapter you are using, let's see some examples:</p>
                    <p>For MQSS Pennylane Adapter, an example is discussed here: <a href="https://munich-quantum-software-stack.github.io/MQSS-Interfaces/pennylane/user_guide/getting_started/#usage" target="_blank" rel="noopener noreferrer">Using MQSS Pennylane Adapter</a>.</p>
                    <p>To learn how to compile with the MQSS CUDA-Q Adapter, please visit: <a href="https://munich-quantum-software-stack.github.io/MQSS-Interfaces/cudaq/md_compilation-flow.html" target="_blank" rel="noopener noreferrer">Compiling using the MQSS CUDA-Q Adapter</a>.</p>
                    <p>And for MQSS Qiskit Adapter: design a circuit using Qiskit's <a href="https://quantum.cloud.ibm.com/docs/en/api/qiskit/qiskit.circuit.QuantumCircuit" target="_blank" rel="noopener noreferrer">QuantumCircuit</a> and submit the circuit for execution on the chosen backend. Specify the number of shots as required (some hardwares have a limit on maximum shots). Note that the circuit is transpiled automatically at server before it is submitted to the backend.</p>
                    <pre>job = backend.run(circuit, shots=1000)</pre>
                    <p>If you want to transpile the circuit yourself, check out this <a href="https://munich-quantum-software-stack.github.io/MQSS-Interfaces/qiskit/user_guide/getting_started/#transpile-circuit-and-submit-job" target="_blank" rel="noopener noreferrer">section</a>.</p>
                </div>
            )
        },
        {
            q: "2. Can I submit a batch of circuits at once?",
            a: (
                <div>
                    <p>Yes, you can submit a batch of circuits using the MQSS adapters.</p>
                    <p>When using the Qiskit Adapter, you can submit a batch of circuits using the run method from <a href="https://munich-quantum-software-stack.github.io/MQSS-Interfaces/qiskit/api/mqss_backend/#mqssqiskitbackend" target="_blank" rel="noopener noreferrer">MQSS Qiskit Backend</a>. More details can be found <a href="https://munich-quantum-software-stack.github.io/MQSS-Interfaces/qiskit/api/mqss_backend/#mqss.qiskit_adapter.backend.MQSSQiskitBackend.run" target="_blank" rel="noopener noreferrer">here</a>.</p>
                    <p>Similarly, for batch circuit submission for the Pennylane Adapter, visit this <a href="https://munich-quantum-software-stack.github.io/MQSS-Interfaces/pennylane/api/MQSSPennylaneBackend/#mqss.pennylane_adapter.backend.MQSSPennylaneBackend.run" target="_blank" rel="noopener noreferrer">section</a> of the documentation.</p>
                </div>
            )
        },
        {
            q: "3. How do I monitor the batch job progress?",
            a: (
                <div>
                    <div>You can check the status of your job as follows. The status indicates the current stage (e.g., QUEUED, SUBMITTED, COMPLETED).</div>
                    <pre>status = job.status()<br />print("Job status:", status)</pre>
                </div>
            )
        },
        {
            q: "4. What are the limits for batch jobs (e.g., number of circuits, size, or runtime)?",
            a: (
                <div>
                    <p>There is no global limit, but provider-specific ones apply:</p>
                    <ul>
                        <li>AQT: up to 50 circuits per batch</li>
                        <li>Jobs with &gt;5 circuits are split into sub-jobs automatically.</li>
                    </ul>
                </div>
            )
        },
        {
            q: "5. What is the limit on the number of gates per job?",
            a: "There is no explicit gate count limit, but execution time is constrained by hardware coherence."
        },
        {
            q: "6. Is there a maximum number of shots per job?",
            a: "The max number of shots per job is also hardware-specific. There is no such limit for Q-Exa hardware but there is a limit of 200 shots per job for the AQT machine."
        },
        {
            q: "7. Can I reserve time on a backend in advance?",
            a: "Not currently. The MQSS uses a queue-based scheduling policy."
        },
        {
            q: "8. Can I run simulations before using real hardware?",
            a: (
                <div>
                    <p>Yes. You can run your circuits on the QLM simulator through the MQSS Qiskit Adapter. You can even use QExa noise model for more accurate simulations if you want to run your scripts on QExa hardware.</p>
                    <p>While using QLM as a backend, submit the circuit without transpilation and disable the QASM3 parameter to False because it is not compatible with the QLM device as of now.</p>
                    <pre>job = backend.run(qc, shots=shots, qasm3=False, queued=True)</pre>
                </div>
            )
        }
    ],
    "Job Tracking and Results": [
        {
            q: "1. How can I check the status of my submitted jobs?",
            a: (
                <div>
                    <p>You can check the status of your job as follows:</p>
                    <p>Using the MQSS Qiskit Adapter:</p>
                    <pre>status = job.status()<br />print("Job status:", status)</pre>
                    <p>The status indicates the current stage (e.g., QUEUED, SUBMITTED, COMPLETED).</p>
                    <p>Using the MQSS Pennylane Adapter:</p>
                    <p>you also need to print the status of MQPJob, for more information, please check out this <a href="https://munich-quantum-software-stack.github.io/MQSS-Interfaces/pennylane/api/MQPJob/#mqss.pennylane_adapter.job.MQPJob.status" target="_blank" rel="noopener noreferrer">section</a>.</p>
                </div>
            )
        },
        {
            q: "2. Where can I find failed jobs and error messages?",
            a: "Failed jobs and their error messages are displayed in the Jobs tab of the MQP portal."
        },
        {
            q: "3. Can I see which circuit was executed in each job?",
            a: "Yes. In the Job Details page of the MQP portal, you can view the Submitted Circuit for each job."
        },
        {
            q: "4. How can I view the transpiled (compiled) version of my circuit?",
            a: "In the Job Details page, the Executed Circuit section displays the transpiled version."
        },
        {
            q: "5. Is there a step-by-step breakdown of the job pipeline, including scheduling and execution?",
            a: "This feature is currently under development and will be available in future updates."
        },
        {
            q: "6. How can I estimate the queue time or expected wait before my job runs?",
            a: (
                <div>
                    <p>This feature implementation is in progress.</p>
                    <p>If you are using the MQSS Qiskit Adapter, you can check if a backend is overloaded by checking the pending number of jobs on it:</p>
                    <pre>print("Number of pending jobs:", backend.num_pending_jobs)</pre>
                </div>
            )
        },
        {
            q: "7. Where can I find logs or diagnostics for failed jobs?",
            a: "In the Jobs section, select a job and check its Note field for logs and diagnostic messages."
        }
    ],
    "System and Hardware Information": [
        {
            q: "1. How can I retrieve the coupling map of a backend?",
            a: (
                <div>
                    <p>Use the coupling_map property of the MQSS backend:</p>
                    <p>It is the same property for both Qiskit and Pennylane adapters.</p>
                    <pre>backend = adapter.get_backend("&lt;resource-name&gt;")<br />print(backend.coupling_map)</pre>
                </div>
            )
        },
        {
            q: "2. How to check when was a device last calibrated?",
            a: "This feature is under development and will be available soon."
        },
        {
            q: "3. When is the next scheduled calibration?",
            a: "This feature is under development and will be available soon."
        },
        {
            q: "4. What are the native gates supported by each backend?",
            a: (
                <div>
                    <p>You can retrieve the target object of the backend to see the supported native gates:</p>
                    <pre>backend = adapter.get_backend("&lt;resource-name&gt;")<br />print(backend.target)</pre>
                </div>
            )
        },
        {
            q: "5. How can I check the current status of a device?",
            a: "Device status (e.g., online, maintenance) is shown in the Resources section of the MQP portal."
        },
        {
            q: "6. What is the best way to optimize my circuit for a specific backend?",
            a: "Circuit transpilation and optimization are performed automatically by the MQSS pipeline before job execution."
        }
    ],
    "Resource Usage and Budgeting": [
        {
            q: "1. What is the quantum budgeting model used by the platform?",
            a: (
                <div>
                    The team is currently in the process of implementing the budgeting model discussed <a href="https://doku.lrz.de/definition-of-the-computing-unit-for-the-lrz-quantum-systems-1898715012.html" target="_blank" rel="noopener noreferrer">here</a>.
                </div>
            )
        },
        {
            q: "2. How does budgeting differ across backends or providers?",
            a: (
                <div>
                    The difference in budgets is also discussed in the documentation <a href="https://doku.lrz.de/definition-of-the-computing-unit-for-the-lrz-quantum-systems-1898715012.html" target="_blank" rel="noopener noreferrer">here</a>.
                </div>
            )
        },
        {
            q: "3. Is there a usage report that shows my quantum resource consumption (e.g., per week or month)?",
            a: "Usage reporting functionality is under development."
        },
        {
            q: "4. Are there any priority tiers or user classes that affect job scheduling?",
            a: "Currently, jobs are scheduled in a fair-share queue."
        }
    ],
    "Troubleshooting": [
        {
            q: "1. What are common error messages and how can I resolve them?",
            a: "A comprehensive list of common error messages and their solutions is being developed and will be available soon."
        }
    ]
};

function FAQ() {
    const darkmode = useSelector((state) => state.accessibilities.darkmode);
    const navigate = useNavigate();

    const [expandedCategory, setExpandedCategory] = useState(null);

    React.useEffect(() => {
        const token = getAuthToken();
        if (!token || token === "EXPIRED") {
            alert("Session expired. Please log in again.");
            navigate("/login");
        }
    }, [navigate]);

    const handleCategoryClick = (cat) => {
        setExpandedCategory(expandedCategory === cat ? null : cat);
    };

    return (
        <ContentCard className={`faq_container ${darkmode ? "dark_bg" : "white_bg"} h-100`}>
            <h2 style={{ fontWeight: "bold", marginBottom: "2rem" }}>
                Frequently Asked Questions
            </h2>
            <div className="faq-categories-list">
                {Object.keys(FAQ_DATA).map((cat, idx) => (
                    <div key={cat} className="faq-category-section mb-4">
                        <div
                            className="faq-category-header"
                            style={{
                                fontWeight: 600,
                                fontSize: "1.15rem",
                                cursor: "pointer",
                                background: expandedCategory === cat ? "#ffe066" : "transparent",
                                borderRadius: "5px",
                                padding: "8px 12px",
                                transition: "background 0.2s"
                            }}
                            onClick={() => handleCategoryClick(cat)}
                        >
                            {cat}
                            <span style={{ float: "right" }}>
                                {expandedCategory === cat ? "▲" : "▼"}
                            </span>
                        </div>
                        {expandedCategory === cat && (
                            <ul className="list-group mt-3">
                                {FAQ_DATA[cat].map((item, qidx) => (
                                    <li key={qidx} className="list-group-item faq-question" style={{ border: "none", background: "transparent", paddingLeft: 0, paddingRight: 0 }}>
                                        <div style={{ fontWeight: 500 }}>{item.q}</div>
                                        <div className="faq-answer mt-1 mb-2" style={{ 
                                            fontSize: "0.97em", 
                                            color: darkmode ? "#e0e0e0" : "#555" 
                                        }}>
                                            {item.a ? item.a : <span style={{ color: darkmode ? "#888" : "#999" }}>Answer coming soon.</span>}
                                        </div>
                                        <div style={{ height: "2px", background: "#ffe066", margin: "8px 0", borderRadius: "1px" }} />
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                ))}
            </div>
        </ContentCard>
    );
}
export default FAQ;
