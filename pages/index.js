// pages/index.js
import React, { useState } from 'react';
import { Camera, MapPin, Home, Users, Building, Euro, Calendar, FileText, Download, Send, CheckCircle, AlertCircle, TrendingUp, Shield, Search, Loader2, Upload, X, FileCheck, FileWarning } from 'lucide-react';

export default function PropertySurvey() {
  const [activeTab, setActiveTab] = useState('upload');
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [documentAnalysis, setDocumentAnalysis] = useState({});
  const [error, setError] = useState('');

  const handleDocumentUpload = (event) => {
    const files = Array.from(event.target.files);
    setUploadedDocuments(prev => [...prev, ...files]);
    setError('');
  };

  const removeDocument = (index) => {
    setUploadedDocuments(prev => prev.filter((_, i) => i !== index));
    const docName = uploadedDocuments[index].name;
    setDocumentAnalysis(prev => {
      const newAnalysis = { ...prev };
      delete newAnalysis[docName];
      return newAnalysis;
    });
  };

  const analyzeDocument = async (doc) => {
    const formData = new FormData();
    formData.append('document', doc);
    formData.append('fileName', doc.name);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || error.message || 'Analysis failed');
      }

      const result = await response.json();
      return result.analysis;
    } catch (error) {
      console.error('Error analyzing document:', error);
      throw error;
    }
  };

  const analyzeDocuments = async () => {
    setIsAnalyzing(true);
    setError('');

    for (const doc of uploadedDocuments) {
      if (documentAnalysis[doc.name]?.status === 'complete') continue;

      setDocumentAnalysis(prev => ({
        ...prev,
        [doc.name]: { status: 'analyzing' }
      }));

      try {
        const analysis = await analyzeDocument(doc);
        
        setDocumentAnalysis(prev => ({
          ...prev,
          [doc.name]: {
            status: 'complete',
            ...analysis
          }
        }));
      } catch (error) {
        setDocumentAnalysis(prev => ({
          ...prev,
          [doc.name]: {
            status: 'error',
            error: error.message
          }
        }));
        setError(`Error analyzing ${doc.name}: ${error.message}`);
      }
    }

    setIsAnalyzing(false);
  };

  const autoFillFromDocument = (extractedData) => {
    // This function would update your form fields
    alert('Auto-fill feature: ' + JSON.stringify(extractedData, null, 2));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                <Search className="w-8 h-8 text-blue-600" />
                Italian Property Survey Tool
              </h1>
              <p className="text-slate-600 mt-2">Professional property due diligence for InvestiScope™ clients</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-500">Survey Date</p>
              <p className="font-semibold">{new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <p className="font-medium">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Document Upload & Analysis</h2>
          
          {/* Upload Area */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors mb-6">
            <input
              type="file"
              id="document-upload"
              multiple
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              onChange={handleDocumentUpload}
              className="hidden"
            />
            <label htmlFor="document-upload" className="cursor-pointer">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-700 mb-2">
                Drop documents here or click to upload
              </p>
              <p className="text-sm text-gray-500">
                Supported formats: PDF, JPG, PNG, DOC, DOCX
              </p>
              <div className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Select Documents
              </div>
            </label>
          </div>

          {/* Uploaded Documents List */}
          {uploadedDocuments.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-800">Uploaded Documents</h3>
              <div className="space-y-3">
                {uploadedDocuments.map((doc, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="w-8 h-8 text-blue-600" />
                        <div>
                          <p className="font-medium text-gray-900">{doc.name}</p>
                          <p className="text-sm text-gray-500">
                            {doc.type} • {(doc.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {documentAnalysis[doc.name] && (
                          <div className="flex items-center gap-2">
                            {documentAnalysis[doc.name].status === 'complete' ? (
                              <FileCheck className="w-5 h-5 text-green-600" />
                            ) : documentAnalysis[doc.name].status === 'error' ? (
                              <FileWarning className="w-5 h-5 text-red-600" />
                            ) : (
                              <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                            )}
                            <span className={`text-sm font-medium ${
                              documentAnalysis[doc.name].status === 'complete' ? 'text-green-600' :
                              documentAnalysis[doc.name].status === 'error' ? 'text-red-600' :
                              'text-blue-600'
                            }`}>
                              {documentAnalysis[doc.name].status === 'analyzing' ? 'Analyzing...' :
                               documentAnalysis[doc.name].status === 'complete' ? 'Analyzed' :
                               'Error'}
                            </span>
                          </div>
                        )}
                        <button
                          onClick={() => removeDocument(index)}
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          <X className="w-5 h-5 text-gray-500" />
                        </button>
                      </div>
                    </div>

                    {/* Analysis Results */}
                    {documentAnalysis[doc.name]?.status === 'complete' && (
                      <div className="mt-4 p-4 bg-white rounded-lg space-y-3">
                        <div>
                          <p className="text-sm font-medium text-gray-700">Document Type:</p>
                          <p className="text-sm text-gray-900">{documentAnalysis[doc.name].documentType}</p>
                        </div>
                        
                        {documentAnalysis[doc.name].extractedData && (
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-2">Extracted Data:</p>
                            <div className="bg-gray-50 p-3 rounded text-sm space-y-1">
                              {Object.entries(documentAnalysis[doc.name].extractedData).map(([key, value]) => (
                                <div key={key} className="flex justify-between">
                                  <span className="text-gray-600">{key}:</span>
                                  <span className="font-medium text-gray-900">{value}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {documentAnalysis[doc.name].issues?.length > 0 && (
                          <div>
                            <p className="text-sm font-medium text-red-700 mb-1">Issues Found:</p>
                            <ul className="text-sm text-red-600 space-y-1">
                              {documentAnalysis[doc.name].issues.map((issue, idx) => (
                                <li key={idx}>• {issue}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {documentAnalysis[doc.name].recommendations?.length > 0 && (
                          <div>
                            <p className="text-sm font-medium text-green-700 mb-1">Recommendations:</p>
                            <ul className="text-sm text-green-600 space-y-1">
                              {documentAnalysis[doc.name].recommendations.map((rec, idx) => (
                                <li key={idx}>• {rec}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <button
                          onClick={() => autoFillFromDocument(documentAnalysis[doc.name].extractedData)}
                          className="mt-2 px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                        >
                          Auto-fill Survey Data
                        </button>
                      </div>
                    )}

                    {documentAnalysis[doc.name]?.status === 'error' && (
                      <div className="mt-4 p-3 bg-red-50 rounded-lg">
                        <p className="text-sm text-red-600">
                          Error: {documentAnalysis[doc.name].error}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Analyze Button */}
              <button
                onClick={analyzeDocuments}
                disabled={isAnalyzing || uploadedDocuments.every(doc => documentAnalysis[doc.name]?.status === 'complete')}
                className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing Documents...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    Analyze with Claude AI
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
