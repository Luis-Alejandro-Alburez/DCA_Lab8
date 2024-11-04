/*************  LABORATORIO IV
 *
 * Vamos a intentar juntar todos los elementos que hemos preparado anteriormente.
 * Creamos una clase Tutoring que tendrá dos listas de usuarios: alumnos y profesores
 * por separado
 *
 * Define los métpdps en la clase:
 *
 * + getStudentByName(name, surname)- que devolverá un studentobjeto con el nombre y
 *                                    apellido indicados (o undefinedsi el estudiante no ha
 *                                    sido agregado antes)
 * + getTeacherByName(name, surname)- que devolverá el teacherobjeto con el nombre y apellido
 *                                    indicados (o undefinedsi el profesor no ha sido agregado
 *                                    antes)
 * + getStudentsForTeacher(teacher)- que devolverá una matriz de estudiantes a los que el
 *                                   profesor puede dar tutoría;
 * + getTeacherForStudent(student)- que devolverá un conjunto de profesores capaces de dar
 *                                  tutoría al estudiante;
 * + addStudent(name, surname, email)- que agregará un nuevo studentobjeto a la lista;
 * + addTeacher(name, surname, email)- que agregará un nuevo teacherobjeto a la lista.
 *
 * Utilice clases previamente preparadas y sus métodos (por ejemplo match).
 *
 * Pruebe su solución utilizando el siguiente código:
 */

class User {
  constructor({ name, surname, email, role }) {
    this.name = name;
    this.surname = surname;
    this.email = email;
    this.role = role;
    this.courses = {}; // Stores courses and levels in an object
    this.messages = []; // Message history
  }

  addCourse(course, level) {
    this.courses[course] = level;
    console.log(
      `${this.name} ha agregado el curso: ${course} con nivel: ${level}`
    );
  }

  removeCourse(course) {
    if (this.courses[course]) {
      delete this.courses[course];
      console.log(`${this.name} ha eliminado el curso: ${course}`);
    } else {
      console.log(`El curso ${course} no existe en la lista.`);
    }
  }

  editCourse(course, level) {
    if (this.courses[course]) {
      this.courses[course] = level;
      console.log(
        `${this.name} ha actualizado el curso: ${course} al nivel: ${level}`
      );
    } else {
      console.log(`El curso ${course} no existe en la lista.`);
    }
  }

  sendMessage(from, message) {
    const fullMessage = `De: ${from.name} (${from.role})\nPara: ${this.name} (${this.role})\nMensaje: ${message}\n`;
    this.messages.push(fullMessage);
    this.sendEmail(from, this, message);
  }

  sendEmail(from, to, message) {
    console.log(`Simulando envío de email de ${from.name} a ${to.name}...`);
  }

  showMessagesHistory() {
    if (this.messages.length === 0) {
      console.log(`${this.name} no ha recibido mensajes.`);
    } else {
      console.log(`Historial de mensajes para ${this.name}:`);
      this.messages.forEach((message, index) => {
        console.log(`Mensaje ${index + 1}:\n${message}`);
      });
    }
  }
}

class ExtendedUser extends User {
  get fullName() {
    return `${this.name} ${this.surname}`;
  }

  set fullName(fullName) {
    [this.name, this.surname] = fullName.split(" ");
  }

  // Static method to find course match between teacher and student
  static match(teacher, student, courseName = null) {
    if (courseName) {
      // Check for specific course match
      if (
        teacher.courses[courseName] &&
        student.courses[courseName] <= teacher.courses[courseName]
      ) {
        return { course: courseName, level: student.courses[courseName] };
      }
      return undefined;
    } else {
      // Check for any course match
      let matches = [];
      for (let course in student.courses) {
        if (
          teacher.courses[course] &&
          student.courses[course] <= teacher.courses[course]
        ) {
          matches.push({ course: course, level: student.courses[course] });
        }
      }
      return matches;
    }
  }
}

// Teacher and Student classes extending ExtendedUser
class Teacher extends ExtendedUser {
  constructor({ name, surname, email }) {
    super({ name, surname, email, role: "teacher" });
  }
}

class Student extends ExtendedUser {
  constructor({ name, surname, email }) {
    super({ name, surname, email, role: "student" });
  }
}

class Tutoring {
  constructor() {
    this.students = [];
    this.teachers = [];
  }

  // Add a new student
  addStudent(name, surname, email) {
    const student = new Student({ name, surname, email });
    this.students.push(student);
  }

  // Add a new teacher
  addTeacher(name, surname, email) {
    const teacher = new Teacher({ name, surname, email });
    this.teachers.push(teacher);
  }

  // Find a student by name and surname
  getStudentByName(name, surname) {
    return this.students.find(
      (student) => student.name === name && student.surname === surname
    );
  }

  // Find a teacher by name and surname
  getTeacherByName(name, surname) {
    return this.teachers.find(
      (teacher) => teacher.name === name && teacher.surname === surname
    );
  }

  // Get a list of students that a teacher can tutor
  getStudentsForTeacher(teacher) {
    return this.students.filter((student) => {
      const matches = ExtendedUser.match(teacher, student);
      return matches.length > 0;
    });
  }

  // Get a list of teachers that can tutor a specific student
  getTeacherForStudent(student) {
    return this.teachers.filter((teacher) => {
      const matches = ExtendedUser.match(teacher, student);
      return matches.length > 0;
    });
  }
}

let tutoring = new Tutoring();
tutoring.addStudent("Rafael", "Fife", "rfife@rhyta.com");
tutoring.addStudent("Kelly", "Estes", "k_estes@dayrep.com");
tutoring.addTeacher("Paula", "Thompkins", "PaulaThompkins@jourrapide.com");
let student = tutoring.getStudentByName("Rafael", "Fife");
student.addCourse("maths", 2);
student.addCourse("physics", 4);
let teacher = tutoring.getTeacherByName("Paula", "Thompkins");
teacher.addCourse("maths", 4);
let students = tutoring.getTeacherForStudent(student);
let teachers = tutoring.getStudentsForTeacher(teacher);
console.log(students[0]); // -> Teacher {name: 'Paula', surname: 'Thompkins', ...
console.log(teachers[0]); // -> Student {name: 'Rafael', surname: 'Fife', ...

student = tutoring.getStudentByName("Kelly", "Estes");
students = tutoring.getTeacherForStudent(student);
teachers = tutoring.getStudentsForTeacher(teacher);
console.log(students[0]); // -> undefined
console.log(teachers[0]); // -> Student {name: 'Rafael', surname: 'Fife', ...
