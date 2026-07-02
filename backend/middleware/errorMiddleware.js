// middleware/errorMiddleware.js

const errorMiddleware = (err, req, res, next) => {
    console.error("🚨 Error Terdeteksi:", err.message);

    // Jika error bawaan berupa angka status (misal: "400" atau "404")
    if (err.message === "400") {
        return res.status(400).json({
            success: false,
            message: "Data yang dikirim tidak valid atau kurang lengkap."
        });
    }

    if (err.message === "403") {
        return res.status(403).json({
            success: false,
            message: "Akses ditolak. Anda tidak memiliki izin."
        });
    }

    if (err.message === "404") {
        return res.status(404).json({
            success: false,
            message: "Data tidak ditemukan."
        });
    }

    // Jika error berupa pesan teks biasa atau error server murni (500)
    const statusCode = err.status || 500;
    const errorMessage = err.status ? err.message : "Internal Server Error. Terjadi masalah pada server Memoora.";

    return res.status(statusCode).json({
        success: false,
        message: errorMessage
    });
};

export default errorMiddleware;