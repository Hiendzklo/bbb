let students = [];

function saveStudent() {
    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let phone = document.getElementById('phone').value;
    let address = document.getElementById('address').value;
    let gender = document.querySelector('input[name="gender"]:checked').value;

    if (!validate(name, email, phone, address)) {
        return;
    }

    let student = { name, email, phone, address, gender };
    students.push(student);
    displayStudents();
    saveToLocalStorage();
    console.log(name);
}

function displayStudents(studentArray = students) {
    const studentList = document.getElementById('studentList');
    studentList.innerHTML = '';
    let count = 1; 
    studentArray.forEach(student => {
        const row = `
            <tr>
                <td>${count}</td>
                <td>${student.name}</td>
                <td>${student.email}</td>
                <td>${student.phone}</td>
                <td>${student.address}</td>
                <td>${student.gender}</td>
                <td>
                    <button onclick="editStudent('${student.email}')">Sửa</button>
                    <button onclick="deleteStudent('${student.email}')">Xóa</button>
                </td>
            </tr>
            `
        studentList.innerHTML += row;
        count++;
    });
}

function deleteStudent(email) {
    // Tìm vị trí của học viên trong mảng students dựa trên địa chỉ email
    let studentIndex = students.findIndex(student => student.email === email);
    if (studentIndex === -1) {
        alert("Không tìm thấy học viên.");
        return;
    }

    // Hiển thị thông báo xác nhận trước khi xóa
    let confirmation = confirm("Bạn có chắc chắn muốn xóa học viên này không?");
    if (confirmation) {
        // Xóa học viên khỏi mảng students tại vị trí đã tìm được
        students.splice(studentIndex, 1);

        // Hiển thị lại danh sách học viên sau khi đã xóa
        displayStudents();

        // Lưu danh sách học viên đã cập nhật vào LocalStorage
        localStorage.setItem('students', JSON.stringify(students));
    }
}



function editStudent(email) {
    // Tìm học viên trong mảng students dựa trên địa chỉ email
    let student = students.find(student => student.email === email);
    if (!student) {
        alert("Không tìm thấy học viên.");
        return;
    }

    // Điền thông tin của học viên vào các trường dữ liệu trên form
    document.getElementById('name').value = student.name;
    document.getElementById('email').value = student.email;
    document.getElementById('phone').value = student.phone;
    document.getElementById('address').value = student.address;
    document.querySelector(`input[name="gender"][value="${student.gender}"]`).checked = true;

    // Disable trường email để không thay đổi email khi sửa
    document.getElementById('email').setAttribute('disabled', 'disabled');

    // Đặt lại sự kiện onclick của nút "Lưu" thành gọi hàm updateStudent(email)
    let saveButton = document.querySelector('button[type="button"]');
    saveButton.innerHTML = 'Cập nhật';
    saveButton.setAttribute('onclick', `updateStudent('${email}')`);
}


function updateStudent(email) {
    // Tìm học viên trong mảng students dựa trên địa chỉ email
    let studentIndex = students.findIndex(student => student.email === email);
    if (studentIndex === -1) {
        alert("Không tìm thấy học viên.");
        return;
    }

    // Cập nhật thông tin học viên từ các trường dữ liệu trên form
    students[studentIndex].name = document.getElementById('name').value;
    students[studentIndex].phone = document.getElementById('phone').value;
    students[studentIndex].address = document.getElementById('address').value;
    students[studentIndex].gender = document.querySelector('input[name="gender"]:checked').value;

    // Hiển thị lại danh sách học viên sau khi đã cập nhật
    displayStudents();
    
    // Xóa thuộc tính disabled cho trường email để cho phép chỉnh sửa lại
    document.getElementById('email').removeAttribute('disabled');

    // Đặt lại nút "Cập nhật" thành "Lưu" và đặt sự kiện onclick cho nút "Lưu"
    let saveButton = document.querySelector('button[type="button"]');
    saveButton.innerHTML = 'Lưu';
    saveButton.setAttribute('onclick', 'saveStudent()');
}



function sortByName() {
    students.sort((a, b) => a.name.localeCompare(b.name));
    displayStudents();
}

function search() {
    let input = document.getElementById('searchInput').value.toLowerCase();
    let filteredStudents = students.filter(student => student.name.toLowerCase().includes(input));
    displayStudents(filteredStudents);
}

function validate(name, email, phone, address) {
    let phoneRegex = /^(0[0-9]{9})$/;
    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || !email || !phone || !address) {
        alert('Vui lòng nhập đầy đủ thông tin.');
        return false;
    }

    if (!emailRegex.test(email)) {
        alert('Email không hợp lệ.');
        return false;
    }

    if (!phoneRegex.test(phone)) {
        alert('Số điện thoại không hợp lệ.');
        return false;
    }   

    return true;
}

function saveToLocalStorage() {
    localStorage.setItem('students', JSON.stringify(students));
}

window.onload = function () {
    let savedStudents = JSON.parse(localStorage.getItem('students'));
    if (savedStudents) {
        students = savedStudents;
        displayStudents();
    }
}
