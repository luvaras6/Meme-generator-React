import React, {useState, useEffect} from 'react';
import Box from '@mui/material/Box';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Display from './Display';
import Select from './Select';
import html2canvas from 'html2canvas';
import '../styles/meme.css';

const Meme = () => {

    const [memes, setMemes] = useState([]);
    const [meme, setMeme] = useState();
    const [topText, setTopText] = useState();
    const [bottomText, setBottomText] = useState();
    const [letra, setLetra] = useState();
    const [tamaño, setTamaño] = useState(5);
    const [color, setColor] = useState();

    useEffect(() => {
        fetch('https://api.imgflip.com/get_memes')
        .then(data => data.json())
        .then(json => 
            {setMemes(json.data.memes);
            setMeme(json.data.memes[0]);
            })
    }, []);

    const textomeme = (e) => {
        setTopText(e.target.value)
    } 

    const cambioLetra = (e) => {
        setLetra(e.target.value)
    }

    const cambioTamaño = (e) => {
        setTamaño(e.target.value)
    }

    const cambioColor = (e) => {
        setColor(e.target.value)
    }

    const Descargar = () => {
        html2canvas(document.querySelector(".exportar")).then(function(canvas) {
            let img = canvas.toDataURL();
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

                    <input onChange={textomeme} className='form' type="text" placeholder="Primera frase" name="meme" arial-label="default input example" ></input>
                    <input onChange={textomeme} className='form' type="text" placeholder="Segunda frase" name="meme" arial-label="default input example" ></input>

                    <button onClick={Descargar} type="button" className='btn'>Descargar meme</button>
                </div>

                <div className='exportar'>
                    {meme && <Display meme = { meme } />}
                </div>
                
                <div>
                    <Select cambioLetra={cambioLetra} cambioColor={cambioColor} cambioTamaño={cambioTamaño} />
                </div>

            </section>

            {/* <p style={{fontSize: `${tamaño}px`, fontFamily: `${letra}`, color: `${color}`}}>{textmeme}</p> */}

            <section className="contenedor-meme">
                <h2 className='api-render'>Imágenes disponibles</h2>
                <Box sx={{ width: 1250, height: 450, margin: 1 }}>
                    <ImageList variant="masonry" cols={4} gap={10}>
                    {memes.map((meme) => (
                        <ImageListItem key={meme.id}>
                            {meme && <Display meme = { meme } onClick = {() => {setMeme(meme)}}/>}
                        </ImageListItem>
                    ))}
                    </ImageList>
                </Box>
            </section>
        </div>
    )
}

export default Meme;