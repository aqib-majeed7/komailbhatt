@echo off
echo ============================================
echo    Komail Art - Setup Script
echo ============================================
echo.

cd /d g:\komail

echo [1/3] Installing all dependencies...
npm install

echo.
echo [2/3] Dependencies installed!
echo.
echo ============================================
echo    SETUP COMPLETE!
echo ============================================
echo.
echo Next steps:
echo  1. Edit .env.local with your Supabase/Cloudinary keys
echo  2. Run: npm run dev
echo  3. Open: http://localhost:3000
echo  4. Admin Panel: http://localhost:3000/admin
echo     Login: admin@gmail.com / admin123
echo.
pause
