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
    const [letra, setLetra] = useState('');
    const [tamaño, setTamaño] = useState(10);
    const [color, setColor] = useState('');
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
    };

    const apiPost = async (e) => {
        e.preventDefault();

        const formData = new FormData();

        formData.append('template_id', meme.id);
        formData.append('username', 'luvaras6');
        formData.append('password', 'Imgapi123');
        formData.append('font', letra);
        formData.append('max_font_size', tamaño);
        formData.append('boxes[0][text]', topText);
        formData.append('boxes[0][color]', color);
        formData.append('boxes[1][text]', bottomText);
        formData.append('boxes[1][color]', color);

        const response = await fetch('https://api.imgflip.com/caption_image', {
            method: 'POST',
            body: formData
        });
        const datos = await response.json();
        console.log(datos);
        setMem(datos.data.url)
    };

    return (
        <div className='contenedor-principal'>
            <h2 className='bienvenida'>Haz click en una imagen y comienza la diversión!</h2>

            <section className='contenedor-edicion'>

                <div className='editores'>
                    <h3 className='subtitulo'>Ingresa el texto del meme</h3>

                    <form className='form' onSubmit={apiPost}>
                        <input onChange={(e) => { setTopText(e.target.value) }} className='input' value={topText} type="text" placeholder="Primera frase" name="meme" arial-label="default input example"></input>
                        <input onChange={(e) => { setBottomText(e.target.value) }} className='input' value={bottomText} type="text" placeholder="Segunda frase" name="meme" arial-label="default input example"></input>

                        <div className='contenedor-btn'>
                            <button type="submit" className='btn'>Crear meme</button>
                            <button onClick={() => setMostrar(!mostrar)} type="button" className='btn'>Mostrar meme</button>
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
                    <Select cambioLetra={(e) => {setLetra(e.target.value)}} cambioColor={(e) => {setColor(e.target.value)}} cambioTamaño={(e) => {setTamaño(e.target.value)}} />
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