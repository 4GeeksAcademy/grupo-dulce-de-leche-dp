
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AlmaCenaSidebar from "../component/AlmaCenaSidebar";
import { Container, Card, Button, Row, Col } from "react-bootstrap";
import "../../styles/myproducts.css";
import redvelvet from "../../img/redvelvet.png";
import CreateRecipeButton from "../component/CreateRecipeButton";
import DeleteRecipeButton from "../component/DeleteRecipeButton";



const Recipes = () => {

  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const token = localStorage.getItem("jwt-token");

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch(process.env.BACKEND_URL + "/dashboard/recipes", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status == 401) { navigate("/login") }
        if (!response.ok) {
          throw new Error("Failed to fetch recipes");
        }

        const recipesData = await response.json();
        setRecipes(recipesData);
      } catch (error) {
        console.error(error);
      }
    };

    if (token) {
      fetchRecipes();
    } else {
      navigate("/login");
    }
  }, [token, navigate]);

  const handleRecipeCreated = async () => {
    try {
      const response = await fetch(process.env.BACKEND_URL + "/dashboard/recipes", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt-token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error fetching updated recipes");
      }

      const data = await response.json();
      setRecipes(data);
    } catch (error) {
      console.error("Error fetching updated recipes:", error);
    }
  };


  return (
    <Container fluid>
      <Row className="principal-recipes">
      <Col md={4} lg={2} className="p-0 m-0" id="reduccion">
          <AlmaCenaSidebar />
        </Col>

        <Col md={8} lg={10} id="reduccion-uno">
          <div className="gris">
            <Row className="boton-categories">
              <Col md={6}>
                <p>
                  Categories: <span>All</span>{" "}
                </p>
              </Col>
              <Col md={6}>
                <CreateRecipeButton onRecipeCreated={handleRecipeCreated} />
              </Col>
          </Row>
            <div className="myproducts bg-white">
            <Row className="g-4 row row-cols-md-2 row-cols-lg-3 row-cols-1">
                {recipes.map((recipe) => (
                  <Col key={recipe.receta_id}>
                    <Card>
                      <Card.Img variant="top" src={redvelvet} />
                      <Card.Body>
                        <Card.Title className="fw-bold">{recipe.nombre}</Card.Title>
                        <Row className="unidades-add">
                          <Col md={12}>
                            <p className="card-text unidades-receta">
                             Total Yield: {recipe.rinde} {recipe.unidad_medida}
                            </p>
                          </Col>
                          <Col className="col-9">
                            <Button
                              variant="primary info-receta"
                              onClick={() => navigate(`/dashboard/recipes/${recipe.receta_id}`)}
                            >
                              See Recipe
                            </Button>
                         </Col>
                        <Col className="col-3">
                        <DeleteRecipeButton recipe={recipe} onRecipeDeleted={handleRecipeCreated} />
                        </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          </div>
   
        </Col>
      </Row>
    </Container>
  );
};

export default Recipes;

