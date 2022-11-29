import React, {useState, useEffect} from 'react';
import Box from '@mui/material/Box';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Display from './Display';
import Select from './Select';
import html2canvas from 'html2canvas';
import '../styles/meme.css';

// Función que devuelve los valores que completan la url al llamar la api
/* const objectToQueryParam = obj => {
    const params = Object.entries(obj).map(([key, value]) => `${key}=${value}`);
    return "?" + params.join("&");
}; */

// Desarrollo de componente 
const Meme = () => {

    const [memes, setMemes] = useState([]);
    const [meme, setMeme] = useState();
    const [topText, setTopText] = useState('');
    const [bottomText, setBottomText] = useState('');
    const [letra, setLetra] = useState();
    const [tamaño, setTamaño] = useState(5);
    const [color, setColor] = useState();
    const [mem, setMem] = useState();
    const [mostrar, setMostrar] = useState(true);

    // Llamada api
    useEffect(() => {
        fetch('https://api.imgflip.com/get_memes')
            .then(data => data.json())
            .then(json => {
                setMemes(json.data.memes);
                setMeme(json.data.memes[0]);
            })
    }, []);

    const cambioLetra = (e) => {
        setLetra(e.target.value)
    }

    const cambioTamaño = (e) => {
        setTamaño(e.target.value)
    }

    const cambioColor = (e) => {
        setColor(e.target.value)
    }

    // Función utilizando html2canvas para descargar meme
    const descargar = () => {
        html2canvas(document.querySelector(".descarga"), { allowTaint: true, useCORS: true, width: 300 })
            .then(function (canvas) {
                let img = canvas.toDataURL("memes/jpg");
                let link = document.createElement("a");
                link.download = "memepropio.jpg";
                link.href = img;
                link.click();
            });
    }

    return (
        <div className='contenedor-principal'>
            <h2 className='bienvenida'>Haz click en una imagen y comienza la diversión!</h2>

            <section className='contenedor-edicion'>

                <div className='editores'>
                    <h3 className='subtitulo'>Ingresa el texto del meme</h3>

                    <form className='form' onSubmit={async (e) => {
                        e.preventDefault();

                        const params = {
                            template_id: meme.id,
                            username: 'luvaras6',
                            password: 'Imgapi123',
                            text0: topText,
                            text1: bottomText,
                            font: letra,
                            max_font_size: tamaño,
                            boxes: [
                                {
                                    'text': topText,
                                    'color': color,
                                    'outline_color': '#000000'
                                },
                                {
                                    'text': bottomText,
                                    'color': color,
                                    'outline_color': '#000000'
                                }
                            ]
                        };

                        const ajustes = {
                            method: 'POST',
                            mode: 'no-cors',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(params)
                        };

                        const response = await fetch(
                            'https://api.imgflip.com/caption_image', ajustes);
                        const datos = await response.json();
                        setMem(datos.data.url)
                    }}>
                        <input onChange={(e) => { setTopText(e.target.value) }} className='input' value={topText} type="text" placeholder="Primera frase" name="meme" arial-label="default input example"></input>
                        <input onChange={(e) => { setBottomText(e.target.value) }} className='input' value={bottomText} type="text" placeholder="Segunda frase" name="meme" arial-label="default input example"></input>

                        <div className='contenedor-btn'>
                            <button onClick={() => setMostrar(!mostrar)} type="submit" className='btn'>Crear meme / Reestablecer</button>
                            <button onClick={descargar} type="button" className='btn'>Descargar meme</button>
                        </div>

                    </form>
                </div>
                
                {mostrar ?
                <div className='meme-elegido'>
                    {meme && <Display meme={meme} />}    
                </div>
                :
                <div className='meme-final'>
                    {mem &&
                    <div>
                        <img style={{ width: 300 }} src={mem} alt="custom meme" className='descarga' />
                    </div>}
                </div>
                }
                <div>
                    <Select cambioLetra={cambioLetra} cambioColor={cambioColor} cambioTamaño={cambioTamaño} />
                </div>

            </section>
                
            <section className="contenedor-meme">
                <h2 className='api-render'>Imágenes disponibles</h2>
                <Box sx={{ width: 1250, height: 450, margin: 1 }}>
                    <ImageList variant="masonry" cols={4} gap={10}>
                        {memes.map((meme) => (
                            <ImageListItem key={meme.id}>
                                {meme && <Display meme={meme} onClick={() => { setMeme(meme) }} />}
                            </ImageListItem>
                        ))}
                    </ImageList>
                </Box>
            </section>
        </div>
    )
}

export default Meme;