import React, {useState} from "react";

export default function ResearchHighlightsTab({items = [], onUpdate}) {
  const [form, setForm] = useState({
    image_path: "",
    link: "",
    description: "",
    alt_text: "",
    order_index: 0,
    is_active: true,
  });
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const uploadImage = async () => {
    if (!file) {
      return;
    }
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/research-highlights/upload-image", {
      method: "POST",
      body: fd,
      credentials: "include",
    });
    if (!res.ok) {
      setUploading(false);
      alert("Image upload failed");
      return;
    }
    const data = await res.json();
    setForm((f) => ({...f, image_path: data.image_path}));
    setUploading(false);
  };

  const createItem = async (e) => {
    e.preventDefault();
    if (!form.image_path) {
      alert("Please upload an image first.");
      return;
    }
    await fetch("/api/research-highlights/", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        image_path: form.image_path,
        link: form.link || null,
        description: form.description || null,
        alt_text: form.alt_text || null,
        order_index: Number(form.order_index) || 0,
        is_active: !!form.is_active,
      }),
      credentials: "include",
    });
    // reset
    setForm({
      image_path: "",
      link: "",
      description: "",
      alt_text: "",
      order_index: 0,
      is_active: true,
    });
    setFile(null);
    onUpdate && onUpdate();
  };

  const updateItem = async (id, patch) => {
    await fetch(`/api/research-highlights/${id}`, {
      method: "PUT",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(patch),
      credentials: "include",
    });
    onUpdate && onUpdate();
  };

  const removeItem = async (id) => {
    if (!window.confirm("Delete this item?")) {
      return;
    }
    await fetch(`/api/research-highlights/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    onUpdate && onUpdate();
  };

  return (
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Research
          Highlights</h2>

        {/* Create form */}
        <form onSubmit={createItem}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {/* 이미지 업로드 */}
          <div className="space-y-2">
            <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="border p-2 w-full bg-white dark:bg-gray-800"
            />
            <div className="flex items-center gap-2">
              <button
                  type="button"
                  onClick={uploadImage}
                  disabled={!file || uploading}
                  className="px-3 py-2 bg-gray-700 text-white rounded disabled:opacity-50"
              >
                {uploading ? "Uploading..." : "Upload Image"}
              </button>
              {form.image_path && (
                  <span className="text-sm text-green-700 dark:text-green-400">
                Uploaded: {form.image_path}
              </span>
              )}
            </div>
            {form.image_path && (
                <img
                    src={form.image_path}
                    alt="preview"
                    className="h-24 w-auto rounded border"
                />
            )}
          </div>

          {/* 메타 */}
          <input
              className="border p-2"
              placeholder="Link (optional)"
              value={form.link}
              onChange={(e) => setForm({...form, link: e.target.value})}
          />
          <input
              className="border p-2"
              placeholder="Alt text"
              value={form.alt_text}
              onChange={(e) => setForm({...form, alt_text: e.target.value})}
          />
          <input
              className="border p-2"
              type="number"
              placeholder="Order index"
              value={form.order_index}
              onChange={(e) => setForm({...form, order_index: e.target.value})}
          />
          <textarea
              className="border p-2 md:col-span-2"
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({...form, description: e.target.value})}
          />
          <label className="flex items-center gap-2">
            <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => setForm(
                    {...form, is_active: e.target.checked})}
            />
            Active
          </label>
          <button className="bg-blue-600 text-white px-4 py-2 rounded">Create
          </button>
        </form>

        {/* List */}
        <div className="space-y-2">
          {items.map((it) => (
              <div key={it.id}
                   className="border p-4 flex items-center gap-4 bg-white dark:bg-gray-800">
                <img src={it.image_path} alt={it.alt_text || ""}
                     className="w-24 h-16 object-cover rounded"/>
                <div className="flex-1">
                  <div className="font-medium">
                    #{it.order_index} {it.description?.slice(0, 80)}
                  </div>
                  <div className="text-sm text-gray-500">{it.link
                      || "(no link)"}</div>
                  <div className="mt-2 flex items-center gap-2">
                    <label className="text-sm text-gray-600">Order:</label>
                    <input
                        type="number"
                        className="border p-1 w-24"
                        defaultValue={it.order_index}
                        onBlur={(e) => updateItem(it.id,
                            {order_index: Number(e.target.value)})}
                    />
                  </div>
                </div>
                <button
                    className="px-3 py-1 border rounded"
                    onClick={() => updateItem(it.id,
                        {is_active: !it.is_active})}
                >
                  {it.is_active ? "Disable" : "Enable"}
                </button>
                <button className="px-3 py-1 border rounded"
                        onClick={() => removeItem(it.id)}>
                  Delete
                </button>
              </div>
          ))}
        </div>
      </div>
  );
}