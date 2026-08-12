# Cloudflare Workers Setup

هذا المشروع تم إعداده للعمل على Cloudflare Workers مع React + Vite + TypeScript.

## الإعداد المكتمل

### 1. التثبيتات
- ✅ تم تثبيت Cloudflare Wrangler CLI عالمياً
- ✅ تم تثبيت @cloudflare/vite-plugin كتطوير
- ✅ تم تحديث Vite إلى أحدث إصدار (v8.2.1)

### 2. ملفات التكوين
- ✅ `wrangler.jsonc` - تكوين Cloudflare Workers
- ✅ `vite.config.cloudflare.ts` - تكوين Vite خاص بـ Cloudflare
- ✅ `worker/index.ts` - نقطة دخول Worker الأساسية
- ✅ تم تحديث `package.json` بالسكريبتات اللازمة

### 3. السكريبتات المتاحة
```bash
# التطوير العادي (بدون Cloudflare)
npm run dev

# التطوير مع Cloudflare Workers
npm run dev:workers

# البناء للنشر العادي
npm run build

# البناء للنشر على Cloudflare
npm run build:workers

# النشر على Cloudflare
npm run deploy
```

## الخطوات التالية

### تسجيل الدخول إلى Cloudflare
```bash
wrangler login
```

### النشر الأول
```bash
npm run deploy
```

## ملخص التكوين

### wrangler.jsonc
- اسم المشروع: blabli
- نقطة الدخول: worker/index.ts
- الأصول الثابتة: dist/
- معالجة SPA: single-page-application
- دعم Node.js: nodejs_compat

### worker/index.ts
- Worker أساسي مع نقطة نهاية API عند `/api/`
- يمكن إضافة منطق إضافي للـ Worker حسب الحاجة

## ملاحظات
- يتم نشر الأصول الثابتة من مجلد `dist/`
- يتم التعامل مع SPA بشكل صحيح مع إعادة التوجيه إلى index.html
- يمكن الوصول إلى Worker API من الـ frontend عبر `/api/`