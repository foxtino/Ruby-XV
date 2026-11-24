import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Upload,
  Image as ImageIcon,
  Copy,
  Check,
  Trash2,
  Key,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Layers,
  ArrowUpRight,
  Maximize2
} from 'lucide-react';
import {
  uploadImageToImgbb,
  saveImgbbImageRecord,
  subscribeImgbbImages,
  deleteImgbbImageRecord,
  toggleImageGalleryStatus,
  getImgbbApiKey,
  setImgbbApiKey,
  ImgbbImageRecord
} from '../lib/imgbb';

export const AdminImgbbManager: React.FC = () => {
  const [images, setImages] = useState<ImgbbImageRecord[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [imageTitle, setImageTitle] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgressMsg, setUploadProgressMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [lastUploaded, setLastUploaded] = useState<ImgbbImageRecord | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const [apiKey, setApiKey] = useState(getImgbbApiKey());
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [tempApiKey, setTempApiKey] = useState(getImgbbApiKey());
  const [keySavedAlert, setKeySavedAlert] = useState(false);

  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const unsubscribe = subscribeImgbbImages((records) => {
      setImages(records);
    });
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  const handleFileChange = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Por favor selecciona un archivo de imagen válido (JPEG, PNG, WEBP, GIF).');
      return;
    }
    setErrorMsg(null);
    setSelectedFile(file);
    if (!imageTitle) {
      setImageTitle(file.name.replace(/\.[^/.]+$/, ''));
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setFilePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setErrorMsg('Selecciona una imagen antes de subir.');
      return;
    }

    setIsUploading(true);
    setErrorMsg(null);
    setUploadProgressMsg('Subiendo imagen a ImgBB...');

    try {
      const record = await uploadImageToImgbb(selectedFile, imageTitle, apiKey);
      setUploadProgressMsg('Guardando enlace permanente...');

      const id = await saveImgbbImageRecord(record);
      const savedRecord = { ...record, id };

      setLastUploaded(savedRecord);
      setSelectedFile(null);
      setFilePreview(null);
      setImageTitle('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err: any) {
      console.error('Error al subir a ImgBB:', err);
      setErrorMsg(err.message || 'Ocurrió un error al subir la imagen a ImgBB.');
    } finally {
      setIsUploading(false);
      setUploadProgressMsg('');
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => {
      setCopiedUrl(null);
    }, 2500);
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    await deleteImgbbImageRecord(id);
    if (lastUploaded?.id === id) {
      setLastUploaded(null);
    }
  };

  const handleToggleGallery = async (id?: string, currentStatus?: boolean) => {
    if (!id) return;
    await toggleImageGalleryStatus(id, !currentStatus);
  };

  const handleSaveApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    setImgbbApiKey(tempApiKey);
    setApiKey(tempApiKey);
    setShowKeyInput(false);
    setKeySavedAlert(true);
    setTimeout(() => setKeySavedAlert(false), 3000);
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="space-y-6 flex-1 overflow-y-auto pr-1">
      {/* Banner */}
      <div className="p-4 rounded-xl bg-[#140407] border border-[#D4AF37]/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#24090F] border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#E8CE86] block">
              Conexión con ImgBB
            </span>
            <p className="text-[11px] text-[#B89B93]">
              Sube fotografías adicionales para agregarlas directamente a la galería de Ruby.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowKeyInput(!showKeyInput)}
          className="px-3 py-1.5 rounded-lg bg-[#24090F] hover:bg-[#2E0C14] text-[#E8D5CE] text-xs flex items-center gap-1.5 transition-colors border border-[#4A1822] cursor-pointer"
        >
          <Key className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>{showKeyInput ? 'Ocultar Llave' : 'Configurar Llave'}</span>
        </button>
      </div>

      {/* API Key Form */}
      <AnimatePresence>
        {showKeyInput && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSaveApiKey}
            className="p-4 bg-[#140407] rounded-xl border border-[#D4AF37]/30 space-y-3"
          >
            <label className="text-xs text-[#E8CE86] font-medium flex items-center gap-2">
              <Key className="w-4 h-4 text-[#D4AF37]" />
              <span>Llave API de ImgBB</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={tempApiKey}
                onChange={(e) => setTempApiKey(e.target.value)}
                placeholder="Ingresa tu API Key de ImgBB"
                className="flex-1 bg-[#24090F] border border-[#4A1822] focus:border-[#D4AF37] rounded-lg px-3 py-2 text-xs text-[#FBF7F2] font-mono focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#D4AF37] hover:bg-[#E8CE86] text-[#140407] text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Guardar
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {keySavedAlert && (
        <div className="p-3 bg-emerald-950/70 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Llave API actualizada correctamente.</span>
        </div>
      )}

      {/* Uploader Card */}
      <div className="bg-[#140407] p-5 sm:p-6 rounded-xl border border-[#4A1822]">
        <h3 className="text-sm font-semibold text-[#FBF7F2] mb-1 flex items-center gap-2">
          <Upload className="w-4 h-4 text-[#D4AF37]" />
          <span>Subir Nueva Fotografía</span>
        </h3>
        <p className="text-xs text-[#B89B93] mb-4 font-light">
          Arrastra o selecciona una foto de Ruby para alojarla en ImgBB y añadirla a su galería.
        </p>

        <form onSubmit={handleUpload} className="space-y-4">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
              isDragging
                ? 'border-[#D4AF37] bg-[#24090F]'
                : filePreview
                ? 'border-[#D4AF37]/60 bg-[#24090F]/70'
                : 'border-[#4A1822] hover:border-[#D4AF37]/50 bg-[#1E060B]/60'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  handleFileChange(e.target.files[0]);
                }
              }}
            />

            {filePreview ? (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <div className="w-24 h-24 rounded-xl overflow-hidden border border-[#D4AF37]/40 shrink-0">
                  <img src={filePreview} alt="Vista previa" className="w-full h-full object-cover" />
                </div>
                <div className="text-center sm:text-left">
                  <span className="text-xs text-[#E8CE86] font-medium block">
                    {selectedFile?.name}
                  </span>
                  <span className="text-[11px] text-[#B89B93] mt-0.5 block tabular-nums">
                    {formatFileSize(selectedFile?.size)}
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-2 py-3">
                <div className="w-11 h-11 rounded-full bg-[#24090F] border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] mx-auto">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <p className="text-xs text-[#FBF7F2] font-medium">
                  Haz clic aquí o arrastra tu fotografía
                </p>
                <p className="text-[11px] text-[#B89B93]">JPG, PNG, WEBP (máximo 32 MB)</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs text-[#E8D5CE] mb-1 font-medium">
                Título o Pie de Foto (Opcional)
              </label>
              <input
                type="text"
                value={imageTitle}
                onChange={(e) => setImageTitle(e.target.value)}
                placeholder="Ej. Sesión de XV Años de Ruby"
                className="w-full bg-[#24090F] border border-[#4A1822] focus:border-[#D4AF37] rounded-xl px-3.5 py-2.5 text-xs text-[#FBF7F2] placeholder-[#B89B93]/50 focus:outline-none"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={!selectedFile || isUploading}
                id="upload-to-imgbb-btn"
                className="w-full py-2.5 px-4 bg-[#D4AF37] hover:bg-[#E8CE86] text-[#140407] font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isUploading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Subiendo...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span>Subir a ImgBB</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {uploadProgressMsg && <p className="text-xs text-[#E8CE86]">{uploadProgressMsg}</p>}

          {errorMsg && (
            <div className="p-3 bg-[#3A0812] border border-[#C41E3A] rounded-xl text-[#FBF7F2] text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-[#E8CE86]" />
              <span>{errorMsg}</span>
            </div>
          )}
        </form>
      </div>

      {/* Just Uploaded Banner */}
      <AnimatePresence>
        {lastUploaded && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-4 rounded-xl bg-[#24090F] border border-[#D4AF37]/40 space-y-3"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#E8CE86] font-semibold">Imagen subida exitosamente</span>
              <span className="text-emerald-400">Añadida a la galería</span>
            </div>

            <div className="flex items-center gap-3 bg-[#140407] p-3 rounded-xl border border-[#4A1822]">
              <img
                src={lastUploaded.thumbUrl || lastUploaded.url}
                alt={lastUploaded.title}
                referrerPolicy="no-referrer"
                className="w-14 h-14 object-cover rounded-lg border border-[#D4AF37]/30 shrink-0"
              />
              <div className="flex-1 min-w-0 flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={lastUploaded.url}
                  className="w-full bg-[#24090F] border border-[#4A1822] rounded-lg px-2.5 py-1.5 text-[11px] font-mono text-[#E8CE86] truncate focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => copyToClipboard(lastUploaded.url)}
                  className="px-3 py-1.5 bg-[#D4AF37] text-[#140407] rounded-lg text-xs font-semibold flex items-center gap-1 shrink-0 cursor-pointer"
                >
                  {copiedUrl === lastUploaded.url ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Uploaded List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#4A1822]">
          <h4 className="text-sm font-semibold text-[#FBF7F2]">
            Imágenes Adicionales ({images.length})
          </h4>
        </div>

        {images.length === 0 ? (
          <div className="p-6 text-center bg-[#140407] rounded-xl border border-[#4A1822] text-[#B89B93] text-xs">
            No se han subido imágenes adicionales todavía.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {images.map((img, idx) => (
              <div
                key={`admin-img-${img.id || img.imgbbId || 'photo'}-${idx}`}
                className="p-3.5 rounded-xl bg-[#140407] border border-[#4A1822] flex flex-col justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-[#24090F] border border-[#4A1822] shrink-0 group">
                    <img
                      src={img.thumbUrl || img.url}
                      alt={img.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <a
                      href={img.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                      title="Abrir imagen"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </a>
                  </div>

                  <div className="flex-1 min-w-0 space-y-1.5">
                    <h5 className="text-xs font-medium text-[#FBF7F2] truncate">{img.title}</h5>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        readOnly
                        value={img.url}
                        className="w-full bg-[#24090F] border border-[#4A1822] rounded px-2 py-1 text-[10px] font-mono text-[#E8D5CE] truncate focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => copyToClipboard(img.url)}
                        className="p-1.5 bg-[#24090F] hover:bg-[#2E0C14] text-[#E8CE86] rounded cursor-pointer"
                        title="Copiar enlace"
                      >
                        {copiedUrl === img.url ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <a
                        href={img.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 bg-[#24090F] hover:bg-[#2E0C14] text-[#E8D5CE] rounded"
                        title="Abrir en nueva pestaña"
                      >
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#4A1822]/60 flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => handleToggleGallery(img.id, img.inGallery)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                      img.inGallery
                        ? 'bg-[#24090F] text-[#E8CE86] border border-[#D4AF37]/40'
                        : 'bg-[#1E060B] text-[#B89B93] border border-[#4A1822]'
                    }`}
                  >
                    {img.inGallery ? 'Visible en Galería' : 'Oculta en Galería'}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(img.id)}
                    className="p-1.5 text-[#B89B93] hover:text-rose-400 rounded-lg transition-colors cursor-pointer"
                    title="Eliminar"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
