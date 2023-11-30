import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/profile.css";
import perfil from '../../img/perfilchef.jpg';
import AlmaCenaSidebar from "../component/AlmaCenaSidebar";
import { Link } from "react-router-dom";

export const EditProfile = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    last_name: "",
    email: "",
    password: "",
    address: "",
    photo_url: "",
  });

  const [editableUser, setEditableUser] = useState({
    name: "",
    last_name: "",
    email: "",
    password: "",
    address: "",
    photo_url: ""
  });

  const [updateSuccess, setUpdateSuccess] = useState(false);

  const token = localStorage.getItem("jwt-token");
  if (!token) {
    navigate("/login");
  }

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch(process.env.BACKEND_URL + "/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt-token")}`
          }
        });
        if (response.status === 401) {
          navigate("/login");
        }
        if (!response.ok) {
          throw new Error("Error fetching dashboard data");
        }
        const data = await response.json();
        setUser({
          name: data.name,
          last_name: data.last_name,
          email: data.email,
          address: data.address,
          password: data.password,
          photo_url: data.photo_url
        });
        setEditableUser({
          name: data.name,
          last_name: data.last_name,
          email: data.email,
          address: data.address,
          password: data.password,
          photo_url: data.photo_url
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableUser((prevUser) => ({
      ...prevUser,
      [name]: value
    }));
  };

  const handleImageChange = async (e) => {
    const newImageFile = e.target.files[0];

    if (newImageFile) {
        try {
            // Cargar la imagen en Cloudinary
            const formData = new FormData();
            formData.append('file', newImageFile);
            formData.append('upload_preset', 'almacena-upload');
            formData.append('cloud_name', 'dq5gjc26f');

            const cloudinaryResponse = await fetch(
                'https://api.cloudinary.com/v1_1/dq5gjc26f/image/upload',
                {
                    method: 'POST',
                    body: formData,
                }
            );

            if (!cloudinaryResponse.ok) {
                throw new Error('Error uploading image to Cloudinary');
            }

            const cloudinaryData = await cloudinaryResponse.json();
            const cloudinaryImageUrl = cloudinaryData.secure_url;

            console.log('Imagen cargada exitosamente en Cloudinary. URL:', cloudinaryImageUrl);

            // Almacenar la URL de la imagen en el estado
            setEditableUser((prevUser) => ({ ...prevUser, photo_url: cloudinaryImageUrl }));
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    }
};

const handleSaveChanges = async () => {
  try {
      // Enviar los datos actualizados al backend en formato JSON
      const response = await fetch(process.env.BACKEND_URL + '/profile', {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('jwt-token')}`,
          },
          body: JSON.stringify({
              ...editableUser,
          }),
      });

      if (!response.ok) {
          throw new Error('Error updating user profile');
      }

      console.log('Datos enviados exitosamente al backend');

      // Actualizar la información del usuario después de la actualización
      setUser(editableUser);

      // Mostrar alerta de éxito
      setUpdateSuccess(true);
  } catch (error) {
      console.error('Error updating user profile:', error);
  }
};

  return (
    <div className="container-fluid">
      <div className="row principal-recipes">
        <div className="p-0 m-0 col-md-4 col-lg-2" id="reduccion">
          <AlmaCenaSidebar />
        </div>
        <div className="col-md-8 col-lg-10" id="reduccion-uno">
          <div className="row principal">
            <div className="col gris">


              <div className="row info">
                <div className="col-11">
                  <h4 className="personal" id="titulo-informacion">Personal information</h4>
                </div>
                <div className="col-1">
                  <Link to="/dashboard/profile">
                    <i className="fa-solid fa-arrow-left fa-2xl icono-personal"></i>{" "}
                  </Link>
                </div>
                <div className="col-12">

                </div>
              </div>

              <form className="profile-user bg-white">

                <div className="row foto">
                  <div className="col-sm-12 col-md-4 col-lg-2">
                  <img className="perfil mb-2" src={editableUser.photo_url || perfil} />
                    <input
                      type="file"
                      accept="image/*"
                      name="photo"
                      onChange={handleImageChange}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  {updateSuccess && (
                    <div className="alert alert-success">
                      Sus datos han sido actualizados correctamente
                    </div>
                  )}


                  <div className="row">
                    <div className="col-sm-12 col-md-6 mb-3">
                      <label className="form-label">
                        Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        placeholder="Your Name"
                        value={editableUser.name}
                        onChange={handleInputChange}
                        name="name"
                      />
                    </div>
                    <div className="col-sm-12 col-md-6 mb-3">
                      <label className="form-label">
                        Last Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="last_name"
                        placeholder="Your Last Name"
                        value={editableUser.last_name}
                        onChange={handleInputChange}
                        name="last_name"
                      />
                    </div>
                    <div className="col-sm-12 col-md-6 mb-3">
                      <label className="form-label">
                        Email
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        placeholder="name@example.com"
                        value={editableUser.email}
                        readOnly
                        disabled

                      />
                    </div>
                    <div className="col-sm-12 col-md-6 mb-3">
                      <label className="form-label">
                        Address
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="address"
                        placeholder="Address"
                        value={editableUser.address}
                        onChange={handleInputChange}
                        name="address"
                      />
                    </div>
                    {/* <div className="col-12 mb-3 position-relative">
                      <label className="form-label">
                        Password
                      </label>
                      <div className="input-group">
                        <input
                          type={showPassword ? "text" : "password"}
                          className="form-control"
                          id="password"
                          placeholder="Password"
                          value={editableUser.password}
                          onChange={handleInputChange}
                          name="password"
                        />
                        <span
                          className="input-group-text toggle-password"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          <i
                            className={`fa ${
                              showPassword ? "fa-eye-slash" : "fa-eye"
                            }`}
                          ></i>
                        </span>
                      </div>
                    </div> */}
                  </div>
                  <button
                    type="button"
                    className="btn btn-primary edit-profile-button"
                    onClick={handleSaveChanges}
                  >
                    Save Changes
                  </button>
                </div>
              </form>



            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
