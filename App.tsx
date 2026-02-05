
import React, { useState, useEffect } from 'react';
import { CaseReport } from './types';
import { polishText } from './services/gemini';
import { 
  Printer, 
  Sparkles, 
  ShieldAlert, 
  Save, 
  Trash2, 
  FileText, 
  ChevronRight,
  School,
  User,
  History,
  CheckCircle2,
  PenTool
} from 'lucide-react';

const INITIAL_REPORT: CaseReport = {
  title: '',
  schoolName: 'SK BANDAR SRI DAMANSARA 1',
  schoolCode: '',
  incidentDate: '',
  schoolAddress: '',
  involvedPerson: {
    name: '',
    icNumber: '',
    position: '',
  },
  chronology: '',
  actionsTaken: '',
  preparedBy: { name: '', position: '', phone: '', date: '' },
  checkedBy: { name: '', position: '', phone: '', date: '' },
  verifiedBy: { name: '', position: '', phone: '', date: '' },
};

export default function App() {
  const [report, setReport] = useState<CaseReport>(INITIAL_REPORT);
  const [isPolishing, setIsPolishing] = useState<{ [key: string]: boolean }>({});
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

  useEffect(() => {
    const saved = localStorage.getItem('draft_report');
    if (saved) {
      try {
        setReport(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load draft", e);
      }
    }
  }, []);

  const handleSaveDraft = () => {
    localStorage.setItem('draft_report', JSON.stringify(report));
    alert('Draf disimpan secara lokal.');
  };

  const handleClear = () => {
    if (window.confirm('Adakah anda pasti mahu memadam semua data?')) {
      setReport(INITIAL_REPORT);
      localStorage.removeItem('draft_report');
    }
  };

  const handlePolish = async (field: 'chronology' | 'actionsTaken') => {
    setIsPolishing(prev => ({ ...prev, [field]: true }));
    const result = await polishText(report[field], field === 'chronology' ? 'chronology' : 'actions');
    setReport(prev => ({ ...prev, [field]: result }));
    setIsPolishing(prev => ({ ...prev, [field]: false }));
  };

  const InputField = ({ label, value, onChange, placeholder, type = 'text', icon: Icon }: any) => (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4 text-blue-600" />}
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
      />
    </div>
  );

  const TextAreaField = ({ label, value, onChange, placeholder, rows = 4, icon: Icon, onPolish, isPolishingField }: any) => (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-1">
        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4 text-blue-600" />}
          {label}
        </label>
        {onPolish && (
          <button
            onClick={onPolish}
            disabled={isPolishingField}
            className="text-xs flex items-center gap-1 bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100 transition-colors disabled:opacity-50"
          >
            {isPolishingField ? <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div> : <Sparkles className="w-3 h-3" />}
            AI Polish
          </button>
        )}
      </div>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none"
      />
    </div>
  );

  return (
    <div className="min-h-screen pb-20">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 no-print">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <FileText className="text-white w-6 h-6" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 hidden md:block">
                Laporan Awal Kes PPD
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setActiveTab('edit')}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${activeTab === 'edit' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                Kemaskini
              </button>
              <button 
                onClick={() => setActiveTab('preview')}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${activeTab === 'preview' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                Pratonton & Cetak
              </button>
              <div className="h-6 w-px bg-gray-200 mx-2" />
              <button onClick={handleSaveDraft} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg" title="Simpan Draf">
                <Save className="w-5 h-5" />
              </button>
              <button onClick={handleClear} className="p-2 text-red-500 hover:bg-red-50 rounded-lg" title="Padam">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {activeTab === 'edit' ? (
        <main className="max-w-4xl mx-auto px-4 py-8 no-print">
          <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-6 md:p-8">
            <div className="flex items-center gap-2 mb-8 bg-red-50 text-red-700 p-3 rounded-xl border border-red-100">
              <ShieldAlert className="w-5 h-5" />
              <span className="font-bold uppercase text-sm tracking-wider">Sulit & Segera</span>
            </div>

            <section className="space-y-8">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <InputField 
                    label="Tajuk Kes" 
                    icon={FileText}
                    value={report.title} 
                    onChange={(v: string) => setReport({ ...report, title: v })} 
                    placeholder="Contoh: Kes Pergaduhan Murid Tahap 2" 
                  />
                </div>
                <InputField 
                  label="Nama Sekolah" 
                  icon={School}
                  value={report.schoolName} 
                  onChange={(v: string) => setReport({ ...report, schoolName: v })} 
                />
                <InputField 
                  label="Kod Sekolah" 
                  value={report.schoolCode} 
                  onChange={(v: string) => setReport({ ...report, schoolCode: v })} 
                  placeholder="BBA82xx"
                />
                <InputField 
                  label="Tarikh Kejadian" 
                  type="date" 
                  value={report.incidentDate} 
                  onChange={(v: string) => setReport({ ...report, incidentDate: v })} 
                />
                <div className="md:col-span-2">
                  <TextAreaField 
                    label="Alamat Sekolah" 
                    rows={2}
                    value={report.schoolAddress} 
                    onChange={(v: string) => setReport({ ...report, schoolAddress: v })} 
                  />
                </div>
              </div>

              {/* Involved Person */}
              <div className="border-t pt-8">
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Maklumat Murid / Pegawai Terlibat
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <InputField 
                    label="Nama" 
                    value={report.involvedPerson.name} 
                    onChange={(v: string) => setReport({ ...report, involvedPerson: { ...report.involvedPerson, name: v } })} 
                  />
                  <InputField 
                    label="No. Kad Pengenalan" 
                    value={report.involvedPerson.icNumber} 
                    onChange={(v: string) => setReport({ ...report, involvedPerson: { ...report.involvedPerson, icNumber: v } })} 
                  />
                  <InputField 
                    label="Kelas / Jawatan" 
                    value={report.involvedPerson.position} 
                    onChange={(v: string) => setReport({ ...report, involvedPerson: { ...report.involvedPerson, position: v } })} 
                  />
                </div>
              </div>

              {/* Narrative */}
              <div className="border-t pt-8">
                <TextAreaField 
                  label="Keterangan Ringkas (Kronologi Kes)" 
                  icon={History}
                  rows={8}
                  value={report.chronology} 
                  onChange={(v: string) => setReport({ ...report, chronology: v })} 
                  onPolish={() => handlePolish('chronology')}
                  isPolishingField={isPolishing.chronology}
                  placeholder="Ceritakan kejadian mengikut turutan masa..."
                />
                <TextAreaField 
                  label="Tindakan Sekolah" 
                  icon={CheckCircle2}
                  rows={6}
                  value={report.actionsTaken} 
                  onChange={(v: string) => setReport({ ...report, actionsTaken: v })} 
                  onPolish={() => handlePolish('actionsTaken')}
                  isPolishingField={isPolishing.actionsTaken}
                  placeholder="Langkah-langkah yang telah diambil oleh pihak sekolah..."
                />
              </div>

              {/* Signatures Form */}
              <div className="border-t pt-8 space-y-8">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <PenTool className="w-5 h-5 text-blue-600" />
                  Maklumat Pengesahan
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-4">
                    <p className="font-semibold text-gray-700">Disediakan Oleh</p>
                    <InputField label="Nama" value={report.preparedBy.name} onChange={(v:string)=>setReport({...report, preparedBy: {...report.preparedBy, name: v}})} />
                    <InputField label="No. HP" value={report.preparedBy.phone} onChange={(v:string)=>setReport({...report, preparedBy: {...report.preparedBy, phone: v}})} />
                  </div>
                  <div className="space-y-4">
                    <p className="font-semibold text-gray-700">Disemak Oleh</p>
                    <InputField label="Nama" value={report.checkedBy.name} onChange={(v:string)=>setReport({...report, checkedBy: {...report.checkedBy, name: v}})} />
                    <InputField label="No. HP" value={report.checkedBy.phone} onChange={(v:string)=>setReport({...report, checkedBy: {...report.checkedBy, phone: v}})} />
                  </div>
                  <div className="space-y-4">
                    <p className="font-semibold text-gray-700">Disahkan Oleh</p>
                    <InputField label="Nama" value={report.verifiedBy.name} onChange={(v:string)=>setReport({...report, verifiedBy: {...report.verifiedBy, name: v}})} />
                    <InputField label="No. HP" value={report.verifiedBy.phone} onChange={(v:string)=>setReport({...report, verifiedBy: {...report.verifiedBy, phone: v}})} />
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
      ) : (
        <ReportPreview report={report} onBack={() => setActiveTab('edit')} />
      )}
    </div>
  );
}

const ReportPreview = ({ report, onBack }: { report: CaseReport, onBack: () => void }) => {
  return (
    <div className="min-h-screen bg-gray-500/10 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="no-print flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <button onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
            <ChevronRight className="w-4 h-4 rotate-180" />
            Kembali ke Editor
          </button>
          <button 
            onClick={() => window.print()} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 font-semibold shadow-md transition-all active:scale-95"
          >
            <Printer className="w-4 h-4" />
            Cetak PDF
          </button>
        </div>

        {/* Paper Container */}
        <div className="print-container bg-white shadow-2xl mx-auto p-[1in] text-black leading-relaxed text-sm min-h-[11.7in] border border-gray-100">
          <div className="font-bold text-left mb-6">SULIT</div>
          
          <div className="text-center border-b-4 border-black pb-4 mb-6">
            <h3 className="text-lg">JPN SELANGOR</h3>
            <h3 className="text-lg">PPD PETALING UTAMA</h3>
            <h2 className="text-2xl font-bold mt-2 tracking-wide uppercase">Laporan Awal Kes</h2>
          </div>

          <div className="inline-block bg-gray-200 border border-black px-3 py-1 font-bold mb-6">
            📌 Makluman Segera
          </div>

          <table className="w-full border-collapse mb-6">
            <tbody>
              <tr>
                <th className="border border-black bg-gray-100 p-3 text-left w-1/3 uppercase font-bold">Tajuk Kes</th>
                <td className="border border-black p-3 font-semibold text-base">{report.title || '-'}</td>
              </tr>
            </tbody>
          </table>

          <div className="bg-gray-100 border border-black border-b-0 px-3 py-1 font-bold uppercase">Maklumat Kes</div>
          <table className="w-full border-collapse mb-6">
            <tbody>
              <tr>
                <td className="border border-black p-2 w-1/3">Nama Sekolah</td>
                <td className="border border-black p-2 font-bold">{report.schoolName || '-'}</td>
              </tr>
              <tr>
                <td className="border border-black p-2">Kod Sekolah</td>
                <td className="border border-black p-2">{report.schoolCode || '-'}</td>
              </tr>
              <tr>
                <td className="border border-black p-2">Tarikh Kejadian</td>
                <td className="border border-black p-2">{report.incidentDate || '-'}</td>
              </tr>
              <tr>
                <td className="border border-black p-2 align-top">Alamat Sekolah</td>
                <td className="border border-black p-2 min-h-[40px] whitespace-pre-wrap">{report.schoolAddress || '-'}</td>
              </tr>
            </tbody>
          </table>

          <div className="bg-gray-100 border border-black border-b-0 px-3 py-1 font-bold uppercase">Maklumat Murid / Pegawai Terlibat</div>
          <table className="w-full border-collapse mb-6">
            <tbody>
              <tr>
                <td className="border border-black p-2 w-1/3">Nama</td>
                <td className="border border-black p-2 font-bold">{report.involvedPerson.name || '-'}</td>
              </tr>
              <tr>
                <td className="border border-black p-2">No. Kad Pengenalan</td>
                <td className="border border-black p-2">{report.involvedPerson.icNumber || '-'}</td>
              </tr>
              <tr>
                <td className="border border-black p-2">Kelas / Jawatan</td>
                <td className="border border-black p-2">{report.involvedPerson.position || '-'}</td>
              </tr>
            </tbody>
          </table>

          <div className="bg-gray-100 border border-black border-b-0 px-3 py-1 font-bold uppercase">Keterangan Ringkas (Kronologi Kes)</div>
          <div className="border border-black p-4 mb-6 min-h-[200px] whitespace-pre-wrap text-justify leading-relaxed">
            {report.chronology || 'Tiada keterangan disediakan.'}
          </div>

          <div className="bg-gray-100 border border-black border-b-0 px-3 py-1 font-bold uppercase">Tindakan Sekolah</div>
          <div className="border border-black p-4 mb-10 min-h-[120px] whitespace-pre-wrap text-justify leading-relaxed">
            {report.actionsTaken || 'Tiada maklumat tindakan disediakan.'}
          </div>

          {/* Signature Grid */}
          <table className="w-full border-collapse mt-auto">
            <tbody>
              <tr className="border border-black">
                <td className="p-4 w-1/3 align-top border-r border-black h-48 relative">
                  <p className="font-bold mb-8">Disediakan oleh:</p>
                  <div className="absolute bottom-4 left-4 right-4 text-xs">
                    <div className="border-t border-dotted border-black pt-1">
                      Nama: {report.preparedBy.name}<br/>
                      No H/P: {report.preparedBy.phone}<br/>
                      Tarikh: {new Date().toLocaleDateString('ms-MY')}
                    </div>
                  </div>
                </td>
                <td className="p-4 w-1/3 align-top border-r border-black h-48 relative">
                  <p className="font-bold mb-8">Disemak oleh:</p>
                   <div className="absolute bottom-4 left-4 right-4 text-xs">
                    <div className="border-t border-dotted border-black pt-1">
                      Nama: {report.checkedBy.name}<br/>
                      No H/P: {report.checkedBy.phone}<br/>
                      Tarikh: 
                    </div>
                  </div>
                </td>
                <td className="p-4 w-1/3 align-top h-48 relative">
                  <p className="font-bold mb-8">Disahkan oleh:</p>
                   <div className="absolute bottom-4 left-4 right-4 text-xs">
                    <div className="border-t border-dotted border-black pt-1">
                      Nama: {report.verifiedBy.name}<br/>
                      No H/P: {report.verifiedBy.phone}<br/>
                      Tarikh: 
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div className="text-center mt-4 italic text-[10px] text-gray-400 no-print">
            Laporan dijana secara digital pada {new Date().toLocaleString('ms-MY')}
          </div>
        </div>
      </div>
    </div>
  );
};
