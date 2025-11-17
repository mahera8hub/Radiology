import React from "react";
import Image from "../assets/mri.jpg";
import {
  FaCloudUploadAlt,
  FaBrain,
  FaLock,
  FaBolt,
  FaStethoscope,
  FaFlask,
  FaCheckCircle,
} from "react-icons/fa";

export default function HomePage() {
  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-text">
          <h1>
            Brain MRI <span className="highlight">Tumor</span>{" "}
            <span className="cerescan">Classifier</span>
          </h1>
          <p>
            Upload MRI scans and let our AI-powered model detect and classify
            brain tumors instantly — secure, fast, and highly accurate.
          </p>
          <button className="upload-btn">
            <FaCloudUploadAlt className="upload-icon" />
            Upload MRI Scan
          </button>
        </div>

        <div className="hero-img">
          <img src={Image} alt="MRI Scan Illustration" />
        </div>
      </section>
{/* Why Choose CereScan */}
{/* Why Choose CereScan */}
<section className="why-section">
  <h2>Why Choose <span className="cerescan-title">CereScan</span>?</h2>
  <p className="subtitle">Cutting-edge technology meets medical precision</p>

  <div className="why-grid">
    {/* AI Detection */}
    <div className="why-card">
      <div className="why-icon-wrapper">
        <FaBrain className="why-icon" />
      </div>
      <h3>AI-Powered Detection</h3>
      <p>
        Deep learning algorithms analyze MRI scans with expert-level precision.
      </p>
    </div>

    {/* HIPAA Compliant */}
    <div className="why-card">
      <div className="why-icon-wrapper">
        <FaLock className="why-icon" />
      </div>
      <h3>HIPAA Compliant</h3>
      <p>
        Your medical data is encrypted and handled with utmost security.
      </p>
    </div>

    {/* Instant Results */}
    <div className="why-card">
      <div className="why-icon-wrapper">
        <FaBolt className="why-icon" />
      </div>
      <h3>Instant Results</h3>
      <p>
        Receive clear, fast classifications in just a few seconds.
      </p>
    </div>
  </div>
</section>


      {/* Detectable Tumor Types */}
      <section className="tumor-section">
        <h2>Detectable Tumor Types</h2>
        <p>Our model can classify the most common brain tumor categories.</p>

        <div className="tumor-grid">
          <div className="tumor-card">
            <FaBrain className="tumor-icon" />
            <h3>Glioma</h3>
            <p>
              Tumors originating from glial cells — often diffuse and
              challenging to detect.
            </p>
          </div>

          <div className="tumor-card">
            <FaStethoscope className="tumor-icon" />
            <h3>Meningioma</h3>
            <p>
              Typically benign tumors developing in the meninges layers of the
              brain.
            </p>
          </div>

          <div className="tumor-card">
            <FaFlask className="tumor-icon" />
            <h3>Pituitary Tumor</h3>
            <p>
              Growths near the pituitary gland affecting hormones and vision.
            </p>
          </div>

          <div className="tumor-card">
            <FaCheckCircle className="tumor-icon" style={{ color: "#10b981" }} />
            <h3>No Tumor Detected</h3>
            <p>
              Normal brain scan — no tumor-like abnormalities detected by AI.
            </p>
          </div>
        </div>
      </section>

      {/* Ready to Get Started Section */}
      <section className="cta-section">
        <h2>Ready to Get Started?</h2>
        <p>Join healthcare professionals using AI-powered diagnostics.</p>
        <button className="cta-btn">
          <FaCloudUploadAlt className="cta-icon" />
          Upload Your First Scan
        </button>
      </section>
    </div>
  );
}
