# 🚀 Quick Start: HTML Import Feature

## Get Started in 60 Seconds

### Step 1: Access HTML Import
1. Log into admin panel at `/admin/login`
2. Click **"⚡ HTML Import"** in the sidebar
   - OR click **"Import HTML"** button on Posts page

### Step 2: Upload HTML File
1. **Drag & drop** your HTML file onto the upload zone
   - OR click to browse and select file
2. Supported formats: `.html`, `.htm`
3. Wait 1-2 seconds for AI processing

### Step 3: Review AI Suggestions
The system automatically extracts:
- ✅ **Title** - From h1, title tag, or meta tags
- ✅ **Content** - Main article content (cleaned)
- ✅ **Excerpt** - Auto-generated summary
- ✅ **Category** - AI-suggested based on content
- ✅ **Tags** - 3-5 relevant tags (marked with ⭐)
- ✅ **Cover Image** - First image from article
- ✅ **Read Time** - Automatically calculated

### Step 4: Edit (Optional)
- Modify title, excerpt, or content
- Change category or tags
- Update cover image URL
- Switch between Visual/HTML preview

### Step 5: Publish
1. Choose **"Save as Draft"** or **"Publish Now"**
2. Click the publish button
3. Done! Article is live on your site

---

## 📝 Try It Now

### Test with Sample File
We've included `sample-article.html` in your project root.

**To test:**
```bash
1. Go to /admin/posts/import
2. Upload sample-article.html
3. See AI magic in action!
```

**Expected Results:**
- Title: "The Future of AI in Business: A Comprehensive Guide"
- Category: AI (auto-detected)
- Tags: AI, Machine Learning, Business, Automation, ChatGPT
- Read Time: ~8 minutes
- Word Count: ~1,500 words

---

## 💡 Pro Tips

### For Best Results
1. **Use semantic HTML** - `<article>`, `<h1>`, `<p>` tags
2. **Include meta tags** - Helps with title/description extraction
3. **Clean HTML** - Remove unnecessary styling/scripts
4. **Absolute URLs** - Use full URLs for images

### Common HTML Patterns
```html
<!-- Good: Semantic structure -->
<article>
  <h1>Title</h1>
  <p>Content...</p>
</article>

<!-- Good: Meta tags -->
<meta name="description" content="...">
<meta name="author" content="...">

<!-- Good: Absolute image URLs -->
<img src="https://example.com/image.jpg">
```

---

## 🎯 What Gets Extracted

### ✅ Included
- Main article content
- Headings (h1-h6)
- Paragraphs and text
- Images with src URLs
- Lists (ul, ol)
- Blockquotes
- Code blocks

### ❌ Removed
- Navigation menus
- Headers/footers
- Sidebars
- Advertisements
- Social share buttons
- Comments sections
- Scripts and styles

---

## 🔧 Troubleshooting

### Issue: "No title detected"
**Fix:** Add `<h1>` tag or `<title>` in your HTML

### Issue: "Content looks messy"
**Fix:** Switch to HTML mode and clean manually

### Issue: "Wrong category"
**Fix:** Manually select from dropdown (AI suggestions are just recommendations)

### Issue: "Images not showing"
**Fix:** Ensure image URLs are absolute (https://...), not relative (../images/...)

---

## 📊 Quality Indicators

After upload, check the success banner:
- **Word Count** - Should be 300+ for good articles
- **Read Time** - Typical: 3-10 minutes
- **Image Count** - At least 1 recommended
- **Quality Score** - Aim for 70%+

---

## 🎨 Workflow Examples

### Scenario 1: Migrate from WordPress
```
1. Export WordPress post as HTML
2. Upload to HTML Import
3. Review AI suggestions
4. Adjust category/tags if needed
5. Publish
```

### Scenario 2: Save Web Article
```
1. Save webpage as HTML (Ctrl+S / Cmd+S)
2. Upload to HTML Import
3. Edit to add your commentary
4. Add attribution in content
5. Publish
```

### Scenario 3: Convert Email Newsletter
```
1. Copy newsletter HTML
2. Save as .html file
3. Upload to HTML Import
4. Clean up formatting
5. Publish as blog post
```

---

## 🚀 Next Steps

After your first import:
1. ✅ Check the published article on your site
2. ✅ Try importing different HTML structures
3. ✅ Experiment with AI suggestions
4. ✅ Set up a content migration workflow
5. ✅ Read the full guide: `HTML_IMPORT_GUIDE.md`

---

## 📞 Need Help?

- **Full Documentation:** See `HTML_IMPORT_GUIDE.md`
- **Sample File:** Use `sample-article.html` for testing
- **Support:** Check troubleshooting section above

---

**Happy Importing! 🎉**

*Transform HTML into published articles in seconds with AI*
