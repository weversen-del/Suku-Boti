const galleryItems = [
    {
        src: '801263_720.jpg',
        alt: 'Pemandangan alam dan rumah masyarakat Suku Boti',
        caption: 'Alam dan kediaman masyarakat Boti'
    },
    {
        src: 'dev-suku-boti-ntt-3.jpeg',
        alt: 'Masyarakat Suku Boti di lingkungan tradisional',
        caption: 'Kehidupan tradisional Suku Boti'
    },
    {
        src: 'dev-serial-suku-boti-2-tenun-ikat-suku-boti-sungguh-memikat.jpeg',
        alt: 'Tenun ikat khas Suku Boti',
        caption: 'Tenun ikat khas budaya Boti'
    },
    {
        src: 'dev-serial-suku-boti-3-suku-boti-benteng-akhir-budaya-di-pulau-timor-5.jpeg',
        alt: 'Benteng budaya dan warisan Suku Boti di Pulau Timor',
        caption: 'Warisan budaya Boti yang tetap terjaga'
    }
];

const translationEntries = [
    {
        term: '“Uis Neno”',
        translation: '“Tuhan Penguasa Langit”',
        note: 'Frasa sakral yang merujuk pada Tuhan Penguasa Langit.'
    },
    {
        term: '“Uis Afu”',
        translation: '“Tuhan Penguasa Bumi”',
        note: 'Istilah untuk Tuhan yang menguasai bumi dan keseimbangan kehidupan.'
    },
    {
        term: '“Halaika”',
        translation: '“Filosofi kehidupan serta hubungan manusia dengan alam”',
        note: 'Pandangan hidup adat yang menekankan harmoni, kehormatan, dan kelestarian alam.'
    }
];

function renderGallery() {
    const galleryGrid = document.getElementById('galeri-grid');
    if (!galleryGrid) return;

    galleryGrid.innerHTML = galleryItems.map(item => `
        <figure class="group overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100 transition-transform duration-300 hover:-translate-y-1">
            <img src="${item.src}" alt="${item.alt}" class="h-72 w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy">
            <figcaption class="p-4 text-sm text-boti-gray">${item.caption}</figcaption>
        </figure>
    `).join('');
}

function updateBreadcrumb(currentText) {
    const breadcrumbCurrent = document.getElementById('breadcrumb-current');
    if (breadcrumbCurrent) {
        breadcrumbCurrent.textContent = currentText;
    }
}

function simulasiTTS() {
    const text = document.getElementById('artikel-sejarah')?.innerText || 'Informasi sejarah Suku Boti.';
    const ttsStatus = document.getElementById('tts-status');
    const ttsButton = document.getElementById('tts-button');

    if (!('speechSynthesis' in window)) {
        if (ttsStatus) {
            ttsStatus.textContent = 'Browser Anda tidak mendukung Speech Synthesis.';
        }
        return;
    }

    if (ttsButton) {
        ttsButton.setAttribute('aria-pressed', 'true');
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'id-ID';
    utterance.rate = 0.95;
    utterance.pitch = 1;

    utterance.onstart = function () {
        if (ttsStatus) {
            ttsStatus.textContent = 'Narasi sejarah sedang diputar.';
        }
    };

    utterance.onend = function () {
        if (ttsStatus) {
            ttsStatus.textContent = 'Narasi selesai diputar.';
        }
        if (ttsButton) {
            ttsButton.setAttribute('aria-pressed', 'false');
        }
    };

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
}

function tampilkanTerjemahanAcak() {
    const termElement = document.getElementById('dawan-term');
    const translationElement = document.getElementById('dawan-translation');
    const noteElement = document.getElementById('dawan-note');

    if (!termElement || !translationElement || !noteElement) {
        return;
    }

    const nextIndex = (Number(termElement.dataset.index || 0) + 1) % translationEntries.length;
    const entry = translationEntries[nextIndex];

    termElement.dataset.index = String(nextIndex);
    termElement.textContent = entry.term;
    translationElement.textContent = entry.translation;
    noteElement.textContent = entry.note;
}

document.addEventListener('DOMContentLoaded', function () {
    const sections = document.querySelectorAll('main section[id]');
    const observer = new IntersectionObserver(function (entries) {
        const visible = entries
            .filter(entry => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible && visible.target && visible.target.id) {
            const labels = {
                beranda: 'Beranda',
                sejarah: 'Sejarah',
                galeri: 'Galeri',
                panduan: 'Panduan Wisata',
                laporan: 'Laporan',
                lokasi: 'Lokasi',
                'kamus-ai': 'Kamus AI Dawan'
            };

            updateBreadcrumb(labels[visible.target.id] || 'Beranda');
        }
    }, {
        threshold: [0.35, 0.75]
    });

    renderGallery();

    sections.forEach(function (section) {
        observer.observe(section);
    });

    const ttsButton = document.getElementById('tts-button');
    if (ttsButton) {
        ttsButton.addEventListener('click', simulasiTTS);
    }

    const translatorButton = document.getElementById('translator-button');
    if (translatorButton) {
        translatorButton.addEventListener('click', tampilkanTerjemahanAcak);
    }
});
