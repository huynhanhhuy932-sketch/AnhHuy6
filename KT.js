
const initialQuestions = [
    {
        topic: "Tổng quan Java",
        q: "Java có đặc điểm nổi bật nào?",
        o: ["Chỉ chạy trên Windows", "Độc lập nền tảng nhờ JVM", "Chỉ thiết kế hình ảnh", "Không hỗ trợ hướng đối tượng"],
        c: 1,
        e: "Java biên dịch thành bytecode và JVM thực thi trên các nền tảng tương thích."
    },
    {
        topic: "Tổng quan Java",
        q: "Phần mở rộng của tệp mã nguồn Java là gì?",
        o: [".html", ".css", ".java", ".sql"],
        c: 2,
        e: "Mã nguồn Java được lưu trong tệp .java."
    },
    {
        topic: "Tổng quan Java",
        q: "Thành phần nào thực thi bytecode Java?",
        o: ["JVM", "CSS", "HTML", "SQL"],
        c: 0,
        e: "JVM là máy ảo thực thi bytecode Java."
    },
    {
        topic: "Biến và kiểu dữ liệu",
        q: "Kiểu dữ liệu nào dùng để lưu số nguyên?",
        o: ["boolean", "int", "char[]", "String"],
        c: 1,
        e: "int là kiểu dữ liệu nguyên thủy dùng lưu số nguyên."
    },
    {
        topic: "Biến và kiểu dữ liệu",
        q: "Từ khóa nào ngăn việc gán lại giá trị cho biến?",
        o: ["final", "constant", "fixed", "staticly"],
        c: 0,
        e: "final ngăn việc gán lại giá trị cho biến sau khi khởi tạo."
    },
    {
        topic: "Biến và kiểu dữ liệu",
        q: "Kiểu dữ liệu nào biểu diễn đúng hoặc sai?",
        o: ["int", "double", "boolean", "char"],
        c: 2,
        e: "boolean nhận giá trị true hoặc false."
    },
    {
        topic: "Câu lệnh điều kiện",
        q: "Câu lệnh nào dùng để rẽ nhánh?",
        o: ["if...else", "import", "package", "class"],
        c: 0,
        e: "if...else chọn nhánh dựa trên điều kiện."
    },
    {
        topic: "Câu lệnh điều kiện",
        q: "Toán tử so sánh bằng trong Java là gì?",
        o: ["=", "===", "==", "!="],
        c: 2,
        e: "== dùng so sánh bằng; = dùng để gán."
    },
    {
        topic: "Câu lệnh điều kiện",
        q: "Cấu trúc nào chọn một trong nhiều trường hợp?",
        o: ["switch", "Scanner", "extends", "import"],
        c: 0,
        e: "switch lựa chọn nhánh phù hợp."
    },
    {
        topic: "Vòng lặp",
        q: "Vòng lặp nào thường dùng khi biết số lần lặp?",
        o: ["if", "for", "switch", "try"],
        c: 1,
        e: "for thường dùng khi xác định số lần lặp."
    },
    {
        topic: "Vòng lặp",
        q: "Từ khóa nào kết thúc vòng lặp ngay lập tức?",
        o: ["continue", "next", "break", "stop"],
        c: 2,
        e: "break kết thúc vòng lặp gần nhất."
    },
    {
        topic: "Vòng lặp",
        q: "while kiểm tra điều kiện khi nào?",
        o: ["Sau khi chạy ít nhất một lần", "Trước mỗi lần chạy thân vòng lặp", "Chỉ khi gặp break", "Không kiểm tra"],
        c: 1,
        e: "while kiểm tra điều kiện trước khi chạy thân vòng lặp."
    }
];

let questions = JSON.parse(localStorage.getItem("jl_questions") || "null") || initialQuestions;
let testQuestions = [];

function page(id, btn) {
    document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
    document.getElementById(id).classList.add("active");

    document.querySelectorAll("nav button").forEach(b => b.classList.remove("active"));
    if (btn) btn.classList.add("active");

    if (id === "practice") renderPractice();
    if (id === "profile") renderProfile();
    if (id === "teacher") renderTeacher();

    window.scrollTo(0, 0);
}

function safe(text) {
    return String(text ?? "").replace(/[&<>"']/g, ch => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;",
        '"': "&quot;", "'": "&#39;"
    })[ch]);
}

function renderPractice() {
    const search = (document.getElementById("search").value || "").toLowerCase();
    const filter = document.getElementById("filter").value;

    const list = questions.filter(q =>
        (filter === "all" || q.topic === filter) &&
        (q.q.toLowerCase().includes(search) || q.topic.toLowerCase().includes(search))
    );

    document.getElementById("questions").innerHTML = list.length
        ? list.map((q, i) => `
            <article class="question">
                <div class="number">${safe(q.topic)}</div>
                <h3>Câu ${i + 1}. ${safe(q.q)}</h3>
                ${q.o.map((o, j) => `
                    <label class="option">
                        <input type="radio" name="practice${questions.indexOf(q)}" value="${j}">
                        <span>${"ABCD"[j]}. ${safe(o)}</span>
                    </label>
                `).join("")}
                <button class="secondary" onclick="checkAnswer(${questions.indexOf(q)}, this)">Kiểm tra đáp án</button>
                <div class="explain"></div>
            </article>
        `).join("")
        : "<p>Không tìm thấy câu hỏi phù hợp.</p>";
}

function checkAnswer(index, button) {
    const q = questions[index];
    const card = button.closest(".question");
    const selected = card.querySelector("input:checked");
    const explain = card.querySelector(".explain");

    if (!selected) {
        alert("Bạn hãy chọn đáp án trước nhé!");
        return;
    }

    explain.classList.add("show");
    explain.innerHTML = (
        Number(selected.value) === q.c
            ? "<b>Chính xác!</b> "
            : "<b>Chưa đúng.</b> Đáp án đúng là " + "ABCD"[q.c] + ". "
    ) + safe(q.e);
}

function startTest() {
    testQuestions = [...questions]
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.min(10, questions.length));

    document.getElementById("testStart").classList.add("hidden");
    document.getElementById("testResult").innerHTML = "";

    const form = document.getElementById("testForm");
    form.classList.remove("hidden");

    form.innerHTML = testQuestions.map((q, i) => `
        <article class="test-question">
            <h3>Câu ${i + 1}. ${safe(q.q)}</h3>
            ${q.o.map((o, j) => `
                <label class="option">
                    <input type="radio" name="t${i}" value="${j}" required>
                    <span>${"ABCD"[j]}. ${safe(o)}</span>
                </label>
            `).join("")}
        </article>
    `).join("") + `
        <button class="primary" type="submit">Nộp bài và xem điểm</button>
    `;
}

function submitTest(event) {
    event.preventDefault();

    let right = 0;
    const detail = [];

    testQuestions.forEach((q, i) => {
        const selected = document.querySelector(`input[name="t${i}"]:checked`);
        const value = selected ? Number(selected.value) : -1;

        if (value === q.c) right++;

        detail.push({
            q: q.q,
            value: value,
            correct: q.c,
            explanation: q.e
        });
    });

    const score = Number((right / testQuestions.length * 10).toFixed(1));
    const history = JSON.parse(localStorage.getItem("jl_history") || "[]");

    history.unshift({
        date: new Date().toLocaleString("vi-VN"),
        score,
        right,
        total: testQuestions.length,
        detail
    });

    localStorage.setItem("jl_history", JSON.stringify(history.slice(0, 30)));
    document.getElementById("testForm").classList.add("hidden");

    document.getElementById("testResult").innerHTML = `
        <div class="result">
            <strong>${score}/10</strong>
            <h2>${score >= 8 ? "Rất tốt!" : score >= 5 ? "Bạn đang tiến bộ!" : "Hãy ôn tập thêm nhé!"}</h2>
            <p>Bạn trả lời đúng ${right}/${testQuestions.length} câu.</p>
            <button class="primary" onclick="startTest()">Làm bài khác</button>
            <button class="secondary" onclick="page('profile')">Xem hồ sơ</button>
        </div>
        <div class="card">
            <h2>Đáp án và lời giải</h2>
            ${detail.map((d, i) => `
                <p><b>Câu ${i + 1}:</b> ${safe(d.q)}<br>
                ${d.value === d.correct ? "Đúng" : "Đáp án đúng: " + "ABCD"[d.correct]}
                · ${safe(d.explanation)}</p>
            `).join("")}
        </div>
    `;

    updateStats();
}

function saveProfile(event) {
    event.preventDefault();

    const profile = {
        name: document.getElementById("name").value.trim(),
        id: document.getElementById("studentId").value.trim(),
        className: document.getElementById("className").value.trim(),
        email: document.getElementById("email").value.trim()
    };

    localStorage.setItem("jl_profile", JSON.stringify(profile));
    renderProfile();
    alert("Đã lưu thông tin sinh viên!");
}

function renderProfile() {
    const p = JSON.parse(localStorage.getItem("jl_profile") || "{}");
    const history = JSON.parse(localStorage.getItem("jl_history") || "[]");

    document.getElementById("name").value = p.name || "";
    document.getElementById("studentId").value = p.id || "";
    document.getElementById("className").value = p.className || "";
    document.getElementById("email").value = p.email || "";

    document.getElementById("displayName").textContent = p.name || "Sinh viên JavaLearn";
    document.getElementById("displayId").textContent = p.id
        ? "MSSV: " + p.id + (p.className ? " · " + p.className : "")
        : "Mã số sinh viên chưa cập nhật";

    document.getElementById("avatar").textContent = p.name
        ? p.name.split(/\s+/).slice(-2).map(x => x[0]).join("").toUpperCase()
        : "SV";

    document.getElementById("profileTests").textContent = history.length;
    document.getElementById("average").textContent =
        (history.length
            ? (history.reduce((sum, item) => sum + item.score, 0) / history.length).toFixed(1)
            : "0") + "/10";

    document.getElementById("history").innerHTML = history.length
        ? history.map(item => `
            <div class="row">
                <div><b>Bài thi Java</b><br><small>${safe(item.date)} · ${item.right}/${item.total} câu đúng</small></div>
                <b>${item.score}/10</b>
            </div>
        `).join("")
        : "Bạn chưa hoàn thành bài thi nào.";

    updateStats();
}

function teacherLogin() {
    if (localStorage.getItem("jl_teacher") !== "yes" &&
        prompt("Nhập mật khẩu giáo viên (bản demo):") !== "java123") {
        alert("Mật khẩu chưa đúng.");
        return;
    }

    localStorage.setItem("jl_teacher", "yes");
    page("teacher");
}

function renderTeacher() {
    document.getElementById("teacherList").innerHTML = questions.map((q, i) => `
        <div class="row">
            <div><b>${safe(q.topic)}</b><p>${safe(q.q)}</p></div>
            <button class="secondary" onclick="deleteQuestion(${i})">Xóa</button>
        </div>
    `).join("");
}

function addQuestion(event) {
    event.preventDefault();

    questions.push({
        topic: document.getElementById("newTopic").value,
        q: document.getElementById("newQ").value,
        o: ["a", "b", "c", "d"].map(id => document.getElementById(id).value),
        c: Number(document.getElementById("correct").value),
        e: document.getElementById("explain").value || "Hãy ôn lại chủ đề liên quan."
    });

    localStorage.setItem("jl_questions", JSON.stringify(questions));
    event.target.reset();
    renderTeacher();
    updateStats();
    alert("Đã thêm câu hỏi.");
}

function deleteQuestion(index) {
    if (questions.length <= 1) {
        alert("Cần giữ ít nhất một câu hỏi.");
        return;
    }

    if (confirm("Bạn có chắc muốn xóa câu hỏi này?")) {
        questions.splice(index, 1);
        localStorage.setItem("jl_questions", JSON.stringify(questions));
        renderTeacher();
        updateStats();
    }
}

function updateStats() {
    document.getElementById("totalQ").textContent = questions.length;
    document.getElementById("totalTests").textContent =
        JSON.parse(localStorage.getItem("jl_history") || "[]").length;
}

renderPractice();
renderProfile();
updateStats();
