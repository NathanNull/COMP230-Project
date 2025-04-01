-- drop trigger PaymentIDEmplace;
-- drop table payment;
-- drop sequence paymentidgen;
-- drop table tutoringsession;
-- drop table subject;
-- drop table student;
-- drop table tutor;
-- drop trigger AdminIDEmplace;
-- drop table admin;
-- drop sequence adminidgen;
-- drop table edcuser;

CREATE TABLE EDCUser (
    EDCUserID INT NOT NULL PRIMARY KEY,
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    Email VARCHAR(100) NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL,
    PhoneNumber VARCHAR(15) NOT NULL,
    UserType VARCHAR(7) NOT NULL CHECK (UserType in ('Tutor', 'Student')),
    RegistrationDate DATE NOT NULL
);


CREATE SEQUENCE AdminIDGen START WITH 1 INCREMENT BY 1 NOCACHE;
CREATE TABLE Admin (
    AdminID INT PRIMARY KEY,
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    Email VARCHAR(100) NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL,
    Role VARCHAR(12) NOT NULL CHECK (Role in ('SuperAdmin', 'SupportAdmin', 'ITAdmin'))
);
CREATE OR REPLACE TRIGGER AdminIDEmplace BEFORE INSERT ON Admin
    FOR EACH ROW
    BEGIN
        IF :NEW.AdminID IS NULL THEN :NEW.AdminID := AdminIDGen.NEXTVAL;
        END IF;
    END;
/

CREATE TABLE Tutor (
    TutorID INT NOT NULL PRIMARY KEY,
    SubjectTaught VARCHAR(50) NOT NULL,
    Qualification VARCHAR(100) NOT NULL,
    Experience INT NOT NULL,
    TutoringMode VARCHAR(9) NOT NULL CHECK (TutoringMode in ('Online', 'In person')),
    HourlyWage DECIMAL(6, 2) NOT NULL,
    LanguageSpoken VARCHAR(50) NOT NULL,
    CONSTRAINT FK_Tutor_Users FOREIGN KEY (TutorID) REFERENCES EDCUser(EDCUserID)
);

CREATE TABLE Student (
    StudentID INT NOT NULL PRIMARY KEY,
    GradeLevel VARCHAR(20) NOT NULL,
    Objective VARCHAR(100) NOT NULL,
    CONSTRAINT FK_Students_Users FOREIGN KEY (StudentID) REFERENCES EDCUser(EDCUserID)
);

CREATE TABLE Subject (
    SubjectID VARCHAR(10) NOT NULL PRIMARY KEY,
    SubjectName VARCHAR(50) NOT NULL,
    Description CLOB NOT NULL
);

CREATE TABLE TutoringSession (
    SessionID VARCHAR(10) NOT NULL PRIMARY KEY,
    TutorID INT NOT NULL,
    StudentID INT NOT NULL,
    SubjectID VARCHAR(10) NOT NULL,
    TutoringMode VARCHAR(9) NOT NULL CHECK (TutoringMode in ('Online', 'In person')),
    SessionDate DATE NOT NULL,
    StartTime DATE NOT NULL CHECK (TRUNC(StartTime) = DATE '1970-01-01'),
    EndTime DATE NOT NULL CHECK (TRUNC(EndTime) = DATE '1970-01-01'),
    SessionStatus VARCHAR(9) NOT NULL CHECK (SessionStatus in ('Scheduled', 'Completed', 'Cancelled')),
    Notes CLOB,
    FOREIGN KEY (TutorID) REFERENCES Tutor(TutorID),
    FOREIGN KEY (StudentID) REFERENCES Student(StudentID),
    FOREIGN KEY (SubjectID) REFERENCES Subject(SubjectID)
);

CREATE OR REPLACE TRIGGER EnforceTutoringSessionTimes
BEFORE INSERT OR UPDATE ON TutoringSession
FOR EACH ROW
BEGIN
    :NEW.StartTime := TO_DATE('1970-01-01', 'YYYY-MM-DD') + (:NEW.StartTime - TRUNC(:NEW.StartTime));
    :NEW.EndTime := TO_DATE('1970-01-01', 'YYYY-MM-DD') + (:NEW.EndTime - TRUNC(:NEW.EndTime));
END;
/

CREATE SEQUENCE PaymentIDGen START WITH 1 INCREMENT BY 1 NOCACHE;
CREATE TABLE Payment (
    PaymentID INT NOT NULL PRIMARY KEY,
    StudentID INT NOT NULL,
    TutorID INT NOT NULL,
    SessionID VARCHAR(10) NOT NULL,
    Amount DECIMAL(10, 2) NOT NULL,
    PaymentMethod VARCHAR(13) NOT NULL CHECK (PaymentMethod in ('Card', 'PayPal', 'Bank Transfer')),
    PaymentStatus VARCHAR(9) NOT NULL CHECK (PaymentStatus in ('Pending', 'Completed', 'Failed')),
    TransactionDate DATE NOT NULL,
    FOREIGN KEY (StudentID) REFERENCES Student(StudentID),
    FOREIGN KEY (TutorID) REFERENCES Tutor(TutorID),
    FOREIGN KEY (SessionID) REFERENCES TutoringSession(SessionID)
);

CREATE OR REPLACE TRIGGER PaymentIDEmplace BEFORE INSERT ON Payment
    FOR EACH ROW
    BEGIN
        IF :NEW.PaymentID IS NULL THEN :NEW.PaymentID := PaymentIDGen.NEXTVAL;
        END IF;
    END;
/