# ⏸️ How to Pause and Resume (Open) Your Vercel Deployment

If you want to temporarily take your live SkillMesh website offline (so it is not accessible to anyone) and then reopen it later, you can manage this directly through the Vercel Web Dashboard.

---

## 🛑 How to Pause Your Deployment (Take Offline)

To block all public access and pause serverless execution:

1. Go to your **[Vercel Dashboard](https://vercel.com/dashboard)**.
2. Click on your **SkillMesh** project.
3. Navigate to **Settings** (top tab navigation) ➔ **General** (default selection on the left).
4. Scroll all the way down to the **Advanced** section.
5. Under **Pause Project**, click **Pause**.
6. Confirm the prompt. 

*Result: Anyone visiting `https://skill-mesh-five.vercel.app/` will see a "Project Paused" landing screen, and no API queries or routes will run.*

---

## ▶️ How to Resume Your Deployment (Open/Bring Online)

To restore full public access and make the application active again:

1. Go to your **[Vercel Dashboard](https://vercel.com/dashboard)**.
2. Click on your **SkillMesh** project (it will display a "Paused" tag next to it).
3. Navigate to **Settings** ➔ **General**.
4. Scroll down to the **Advanced** section.
5. Under **Resume Project**, click **Resume**.

*Result: Your deployment is instantly back online at the same URL, and the database auto-seeding will boot up on the first request.*
