import React, { useState, useEffect } from "react";
import {
  Save,
  Upload,
  Image as ImageIcon,
  FileText,
  Globe,
  Eye,
  X,
  Plus,
  Trash2,
  Search,
} from "lucide-react";
import toast from "react-hot-toast";
import Loading from "../../components/Common/Loading";

// Simple WYSIWYG Editor Component (using contentEditable)
const RichTextEditor = ({ value, onChange, placeholder = "Enter text..." }) => {
  const [content, setContent] = useState(value || "");

  useEffect(() => {
    setContent(value || "");
  }, [value]);

  const handleInput = (e) => {
    const newContent = e.target.innerHTML;
    setContent(newContent);
    onChange(newContent);
  };

  const applyFormat = (command, value = null) => {
    document.execCommand(command, false, value);
    const editor = document.querySelector('[contenteditable]');
    if (editor) editor.focus();
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-300 p-2 flex items-center gap-2 flex-wrap">
        <button
          type="button"
          onClick={() => applyFormat("bold")}
          className="px-3 py-1.5 text-sm font-bold border border-gray-300 rounded hover:bg-gray-200"
          title="Bold">
          <strong>B</strong>
        </button>
        <button
          type="button"
          onClick={() => applyFormat("italic")}
          className="px-3 py-1.5 text-sm italic border border-gray-300 rounded hover:bg-gray-200"
          title="Italic">
          <em>I</em>
        </button>
        <button
          type="button"
          onClick={() => applyFormat("underline")}
          className="px-3 py-1.5 text-sm underline border border-gray-300 rounded hover:bg-gray-200"
          title="Underline">
          <u>U</u>
        </button>
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <button
          type="button"
          onClick={() => applyFormat("insertUnorderedList")}
          className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-200"
          title="Bullet List">
          •
        </button>
        <button
          type="button"
          onClick={() => applyFormat("insertOrderedList")}
          className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-200"
          title="Numbered List">
          1.
        </button>
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <button
          type="button"
          onClick={() => {
            const url = prompt("Enter URL:");
            if (url) applyFormat("createLink", url);
          }}
          className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-200"
          title="Insert Link">
          🔗
        </button>
      </div>
      {/* Editor */}
      <div
        contentEditable
        onInput={handleInput}
        dangerouslySetInnerHTML={{ __html: content }}
        className="min-h-[200px] p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        style={{ minHeight: "200px" }}
        data-placeholder={placeholder}
      />
      <style>{`
        [contenteditable][data-placeholder]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
        }
      `}</style>
    </div>
  );
};

const AdminHomepageContent = () => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("hero");

  // Hero Section
  const [heroTitle, setHeroTitle] = useState("");
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [heroCtaLabel, setHeroCtaLabel] = useState("");
  const [heroBackgroundImage, setHeroBackgroundImage] = useState(null);
  const [heroBackgroundPreview, setHeroBackgroundPreview] = useState("");

  // About/Mission Section
  const [aboutTitle, setAboutTitle] = useState("");
  const [aboutContent, setAboutContent] = useState("");
  const [aboutImage, setAboutImage] = useState(null);
  const [aboutImagePreview, setAboutImagePreview] = useState("");

  // Selling Points
  const [sellingPoints, setSellingPoints] = useState([
    { id: 1, title: "", description: "", icon: "" },
  ]);

  // Footer
  const [footerText, setFooterText] = useState("");
  const [footerLinks, setFooterLinks] = useState([
    { id: 1, label: "", url: "" },
  ]);

  // SEO Metadata
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [seoKeywords, setSeoKeywords] = useState("");

  // Image Upload Handler
  const handleImageUpload = (e, setImage, setPreview) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (setImage, setPreview) => {
    setImage(null);
    setPreview("");
  };

  // Selling Points Management
  const addSellingPoint = () => {
    setSellingPoints([
      ...sellingPoints,
      { id: Date.now(), title: "", description: "", icon: "" },
    ]);
  };

  const removeSellingPoint = (id) => {
    if (sellingPoints.length > 1) {
      setSellingPoints(sellingPoints.filter((point) => point.id !== id));
    } else {
      toast.error("At least one selling point is required");
    }
  };

  const updateSellingPoint = (id, field, value) => {
    setSellingPoints(
      sellingPoints.map((point) =>
        point.id === id ? { ...point, [field]: value } : point
      )
    );
  };

  // Footer Links Management
  const addFooterLink = () => {
    setFooterLinks([...footerLinks, { id: Date.now(), label: "", url: "" }]);
  };

  const removeFooterLink = (id) => {
    if (footerLinks.length > 1) {
      setFooterLinks(footerLinks.filter((link) => link.id !== id));
    } else {
      toast.error("At least one footer link is required");
    }
  };

  const updateFooterLink = (id, field, value) => {
    setFooterLinks(
      footerLinks.map((link) =>
        link.id === id ? { ...link, [field]: value } : link
      )
    );
  };

  // Save Handler
  const handleSave = async () => {
    setSaving(true);
    try {
      // TODO: Implement API call to save content
      // For now, just simulate saving
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const contentData = {
        hero: {
          title: heroTitle,
          subtitle: heroSubtitle,
          ctaLabel: heroCtaLabel,
          backgroundImage: heroBackgroundImage,
        },
        about: {
          title: aboutTitle,
          content: aboutContent,
          image: aboutImage,
        },
        sellingPoints,
        footer: {
          text: footerText,
          links: footerLinks,
        },
        seo: {
          title: seoTitle,
          description: seoDescription,
          keywords: seoKeywords,
        },
      };

      console.log("Content to save:", contentData);
      toast.success("Content saved successfully!");
    } catch (error) {
      toast.error("Failed to save content");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  // Load existing content (simulated)
  useEffect(() => {
    setLoading(true);
    // TODO: Fetch existing content from API
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return <Loading message="Loading homepage content..." />;
  }

  const tabs = [
    { id: "hero", label: "Hero Section", icon: ImageIcon },
    { id: "about", label: "About/Mission", icon: FileText },
    { id: "selling", label: "Selling Points", icon: Globe },
    { id: "footer", label: "Footer", icon: FileText },
    { id: "seo", label: "SEO Metadata", icon: Search },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Homepage Content Management
            </h2>
            <p className="text-gray-600 mt-1">
              Manage and edit your homepage content, images, and SEO settings
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold shadow-sm transition-all">
            <Save size={20} />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-200 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-semibold text-sm transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? "text-gray-900 border-b-2 border-gray-900 bg-gray-50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}>
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="p-6">
          {/* Hero Section Tab */}
          {activeTab === "hero" && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Hero Title
                </label>
                <input
                  type="text"
                  value={heroTitle}
                  onChange={(e) => setHeroTitle(e.target.value)}
                  placeholder="Enter hero title..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Hero Subtitle/Description
                </label>
                <textarea
                  value={heroSubtitle}
                  onChange={(e) => setHeroSubtitle(e.target.value)}
                  placeholder="Enter hero subtitle or description..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  CTA Button Label
                </label>
                <input
                  type="text"
                  value={heroCtaLabel}
                  onChange={(e) => setHeroCtaLabel(e.target.value)}
                  placeholder="e.g., Get Started, Explore Now..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Hero Background Image
                </label>
                <div className="space-y-4">
                  {heroBackgroundPreview ? (
                    <div className="relative">
                      <img
                        src={heroBackgroundPreview}
                        alt="Hero background preview"
                        className="w-full h-64 object-cover rounded-lg border border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(setHeroBackgroundImage, setHeroBackgroundPreview)}
                        className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700">
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">No image uploaded</p>
                      <label className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 cursor-pointer">
                        <Upload size={18} />
                        Upload Image
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            handleImageUpload(
                              e,
                              setHeroBackgroundImage,
                              setHeroBackgroundPreview
                            )
                          }
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* About/Mission Section Tab */}
          {activeTab === "about" && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  About/Mission Title
                </label>
                <input
                  type="text"
                  value={aboutTitle}
                  onChange={(e) => setAboutTitle(e.target.value)}
                  placeholder="Enter about/mission title..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  About/Mission Content
                </label>
                <RichTextEditor
                  value={aboutContent}
                  onChange={setAboutContent}
                  placeholder="Enter about/mission content..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  About Section Image
                </label>
                <div className="space-y-4">
                  {aboutImagePreview ? (
                    <div className="relative">
                      <img
                        src={aboutImagePreview}
                        alt="About section preview"
                        className="w-full h-64 object-cover rounded-lg border border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(setAboutImage, setAboutImagePreview)}
                        className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700">
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">No image uploaded</p>
                      <label className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 cursor-pointer">
                        <Upload size={18} />
                        Upload Image
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            handleImageUpload(
                              e,
                              setAboutImage,
                              setAboutImagePreview
                            )
                          }
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Selling Points Tab */}
          {activeTab === "selling" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Highlighted Selling Points
                </h3>
                <button
                  type="button"
                  onClick={addSellingPoint}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800">
                  <Plus size={18} />
                  Add Point
                </button>
              </div>

              <div className="space-y-4">
                {sellingPoints.map((point, index) => (
                  <div
                    key={point.id}
                    className="p-4 border border-gray-300 rounded-lg bg-gray-50">
                    <div className="flex items-start justify-between mb-4">
                      <h4 className="font-semibold text-gray-900">
                        Point {index + 1}
                      </h4>
                      {sellingPoints.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSellingPoint(point.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Title
                        </label>
                        <input
                          type="text"
                          value={point.title}
                          onChange={(e) =>
                            updateSellingPoint(point.id, "title", e.target.value)
                          }
                          placeholder="Enter point title..."
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description
                        </label>
                        <textarea
                          value={point.description}
                          onChange={(e) =>
                            updateSellingPoint(
                              point.id,
                              "description",
                              e.target.value
                            )
                          }
                          placeholder="Enter point description..."
                          rows={3}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Icon (Emoji or Icon Name)
                        </label>
                        <input
                          type="text"
                          value={point.icon}
                          onChange={(e) =>
                            updateSellingPoint(point.id, "icon", e.target.value)
                          }
                          placeholder="e.g., 🎨, 🎭, 🎵 or icon name"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer Tab */}
          {activeTab === "footer" && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Footer Text
                </label>
                <RichTextEditor
                  value={footerText}
                  onChange={setFooterText}
                  placeholder="Enter footer text..."
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Footer Links
                  </h3>
                  <button
                    type="button"
                    onClick={addFooterLink}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800">
                    <Plus size={18} />
                    Add Link
                  </button>
                </div>

                <div className="space-y-4">
                  {footerLinks.map((link, index) => (
                    <div
                      key={link.id}
                      className="p-4 border border-gray-300 rounded-lg bg-gray-50">
                      <div className="flex items-start justify-between mb-4">
                        <h4 className="font-semibold text-gray-900">
                          Link {index + 1}
                        </h4>
                        {footerLinks.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeFooterLink(link.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Label
                          </label>
                          <input
                            type="text"
                            value={link.label}
                            onChange={(e) =>
                              updateFooterLink(link.id, "label", e.target.value)
                            }
                            placeholder="Link label..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            URL
                          </label>
                          <input
                            type="url"
                            value={link.url}
                            onChange={(e) =>
                              updateFooterLink(link.id, "url", e.target.value)
                            }
                            placeholder="https://..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SEO Metadata Tab */}
          {activeTab === "seo" && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> SEO metadata helps improve your
                  website's visibility in search engines. Fill in these fields
                  to optimize your homepage for search results.
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Page Title (Meta Title)
                </label>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder="Enter page title (50-60 characters recommended)..."
                  maxLength={60}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {seoTitle.length}/60 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Meta Description
                </label>
                <textarea
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  placeholder="Enter meta description (150-160 characters recommended)..."
                  rows={4}
                  maxLength={160}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {seoDescription.length}/160 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Keywords (comma-separated)
                </label>
                <input
                  type="text"
                  value={seoKeywords}
                  onChange={(e) => setSeoKeywords(e.target.value)}
                  placeholder="e.g., culture, education, learning, traditional..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Separate keywords with commas
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminHomepageContent;
