import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./App.css";
import { FaEye, FaTrash } from "react-icons/fa";

const App = () => {
  const [cvList, setCvList] = useState([]);
  const [selectedCv, setSelectedCv] = useState(null);

  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      phone: "",
      image: null,
      experience: "",
    },
    validationSchema: Yup.object({
      fullName: Yup.string().required("Full Name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      phone: Yup.string().required("Phone is required"),
      image: Yup.mixed().required("Image is required"),
      experience: Yup.string().required("Experience is required"),
    }),
    onSubmit: (values, { resetForm }) => {
      setCvList([...cvList, values]);
      resetForm();
      document.querySelector("input[type='file']").value = "";
    },
  });

  const handleDelete = (index) => {
    setCvList(cvList.filter((_, i) => i !== index));
    setSelectedCv(null);
  };

  const handleDownloadCV = () => {
    if (!selectedCv) return;

    const cvContent = `Name: ${selectedCv.fullName}\nEmail: ${selectedCv.email}\nPhone: ${selectedCv.phone}\nExperience: ${selectedCv.experience}`;
    const blob = new Blob([cvContent], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${selectedCv.fullName}_CV.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container">
      <h1>CV Generate App</h1>
      <div className="content">
        <form className="cv-form" onSubmit={formik.handleSubmit}>
          <h2 className="form-title">CV Form</h2>
          <input type="text" name="fullName" placeholder="Full Name" {...formik.getFieldProps("fullName")} />
          {formik.touched.fullName && formik.errors.fullName ? <div className="error">{formik.errors.fullName}</div> : null}
          
          <input type="email" name="email" placeholder="Email" {...formik.getFieldProps("email")} />
          {formik.touched.email && formik.errors.email ? <div className="error">{formik.errors.email}</div> : null}
          
          <input type="tel" name="phone" placeholder="Phone" {...formik.getFieldProps("phone")} />
          {formik.touched.phone && formik.errors.phone ? <div className="error">{formik.errors.phone}</div> : null}
          
          <input type="file" name="image" onChange={(event) => formik.setFieldValue("image", event.currentTarget.files[0])} />
          {formik.touched.image && formik.errors.image ? <div className="error">{formik.errors.image}</div> : null}
          
          <textarea name="experience" placeholder="Experience" {...formik.getFieldProps("experience")} />
          {formik.touched.experience && formik.errors.experience ? <div className="error">{formik.errors.experience}</div> : null}
          
          <button type="submit">Submit</button>
        </form>
        {selectedCv && (
          <div className="cv-display">
            <div className="cv-card">
              <img src={URL.createObjectURL(selectedCv.image)} alt={selectedCv.fullName} className="cv-image" />
              <h3>{selectedCv.fullName}</h3>
              <div className="cv-details">
                <p><strong>Email:</strong> {selectedCv.email}</p>
                <p><strong>Phone:</strong> {selectedCv.phone}</p>
                <p><strong>Experience:</strong> {selectedCv.experience}</p>
              </div>
              <button className="download-btn" onClick={handleDownloadCV}>Download CV</button>
            </div>
          </div>
        )}
      </div>
      <h2 className="text-info">
  Personal Information
</h2>
      <table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Email</th>
      <th>Phone</th>
      <th>Image</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {cvList.length === 0 ? (
      <tr>
        <td colSpan="5">
          <h3 style={{ textAlign: "center", color: "#264c74" }}>No CV's added yet.</h3>
        </td>
      </tr>
    ) : (
      cvList.map((cv, index) => (
        <tr key={index}>
          <td>{cv.fullName}</td>
          <td>{cv.email}</td>
          <td>{cv.phone}</td>
          <td><img src={URL.createObjectURL(cv.image)} alt={cv.fullName} className="table-img" /></td>
          <td className="act-btn">
            <button className="show-btn" onClick={() => setSelectedCv(cv)}>
               <FaEye /> Show CV
            </button>
            <button className="delete-btn" onClick={() => handleDelete(index)}>
               <FaTrash /> Delete CV
            </button>
          </td>
        </tr>
      ))
    )}
  </tbody>
</table>

    </div>
  );
};

export default App;