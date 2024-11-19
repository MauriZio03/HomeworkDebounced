import React, { useState, useEffect, useSyncExternalStore } from 'react';
import ReactDOM from 'react-dom/client';


function App() {
  const [texto, setTexto] = useState(''); //Estadp para el texto
  const [debouncedTexto, setDebouncedTexto] = useState(''); // Estado para manejar el texto con debounce
  const [pokemonDatos, setPokemonDatos] = useState('');
  const [pokemonPeso, setPokemonPeso] = useState('');
  const [pokemonAltura, setpokemonAltura] = useState('');
  const [pokemonImagen, setPokemonImagen] = useState(null); 

  // Función para manejar cambios en el input
  const manejarCambio = (event) => {
    setTexto(event.target.value);
  };

  // Función para realizar la consulta API
  useEffect(() => {
    const consultarAPI = async () => {
      if (debouncedTexto.trim() === '') return; 
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${debouncedTexto.toLowerCase()}`);
        const data = await response.json();
        setPokemonDatos(data.order || 'No encontrado');
        //setPokemonImagen(data.other.['official-artwork']?.front_default || null);
        setPokemonImagen(data['sprites']?.['other']?.['official-artwork']?.front_default || null);
        setpokemonAltura(data.height || 'No encontrado');
        setPokemonPeso(data.weight || 'No encontrado');
      } catch (error) {
        console.error('Error al consultar la API:', error);
        setPokemonDatos('Error en la consulta');
        setPokemonImagen(null);
        setpokemonAltura('Error en la consulta');
        setPokemonPeso('Error en la consulta');
      }
  };

  consultarAPI();
  }, [debouncedTexto]);

  // Implementación de debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedTexto(texto); // Actualizar el estado debounced después de 3 segundos
    }, 3000); 

    return () => {
      clearTimeout(handler); // Limpiar el temporizador si el texto cambia antes de los 3 segundos
    };
  }, [texto]); // Ejecutar ese efecto cuando el texto cambia


  return (
    <div style={{ textAlign: 'center', marginTop: '50px', backgroundColor: '#f8d030', padding: '20px', borderRadius: '10px' }}>
    <h1 style={{ color: '#333', fontFamily: 'Pokemon', fontSize: '36px', marginBottom: '30px' }}>
      Consulta API POKEMON
    </h1>    
    <label style={{ fontSize: '18px', fontWeight: 'bold', color: '#333', display: 'block', marginBottom: '10px' }}>
      Ingresa el nombre del POKEMON:
      <input
        type="text"
        value={texto}
        onChange={manejarCambio}
        style={{
          marginLeft: '10px',
          padding: '10px',
          fontSize: '18px',
          borderRadius: '5px',
          border: '2px solid #ffcc00',
          backgroundColor: '#fff4e0',
          color: '#333',
          width: '250px',
        }}
      />
    </label>
    <p style={{ marginTop: '20px', fontSize: '20px', color: '#333' }}>
      <strong style={{ color: '#333' }}>Número:</strong> {pokemonDatos}
    </p>
    <p style={{ marginTop: '20px', fontSize: '20px', color: '#333' }}>
      <strong style={{ color: '#333' }}>Altura:</strong> {pokemonAltura}
    </p>
    <p style={{ marginTop: '20px', fontSize: '20px', color: '#333' }}>
      <strong style={{ color: '#333' }}>Peso:</strong> {pokemonPeso}
    </p>
    {pokemonImagen ? (
      <div style={{ marginTop: '20px' }}>
        <img src={pokemonImagen} alt="Pokemon" style={{ width: '200px', borderRadius: '10px', border: '5px solid #ffcc00' }} />
      </div>
    ) : (
      debouncedTexto && <p style={{ marginTop: '20px', color: '#ff0000', fontSize: '18px' }}>No se encontró el Pokémon</p>
    )}
      {/*
      BOTTON
      <button
        onClick={consultarAPI}
        style={{ padding: '10px 20px', fontSize: '16px', marginLeft: '10px' }}
      >
        Consultar API
      </button>
      */}
    </div>
  );
}



const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
