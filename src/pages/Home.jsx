import "../css/Home.css"
import MovieCard from "../components/moviecard";
import { useEffect, useState } from "react";
import { searchMovies ,getPopularMovies } from "../services/Api";


function Home(){

    const [searchQuery , setsearchQuery] = useState("")
    const [movies , setMovies] = useState([])
    const [error,setError] = useState(null)
    const [loading , setLoading] = useState(true)

    useEffect(() => {
        const loadPopularMovies = async () => {
            try {
                const popularMovies = await getPopularMovies()
                setMovies(popularMovies)
            } catch(err){
                setError("failed to load")
            }
            finally{
                setLoading(false)
            }
        }
        loadPopularMovies()
    } , [])

    const handlesearch = async(e) => {
        e.preventDefault()
        
        if(!searchQuery.trim()) return
        if(loading) return
        setLoading(true)

        try{
            const searchResults = await searchMovies(searchQuery)
            setMovies(searchResults)
            setError(null)
        } catch(err){
            setError("failed to load")
        }finally{
            setLoading(false)
        }

        setsearchQuery("")
    }

    return (
        <div className="home"> 
            <form onSubmit={handlesearch} className="search-form"> 
                <input
                    type="text"
                    placeholder="search movie.."
                    className="search-input"
                    value ={searchQuery}
                    onChange={(e) => setsearchQuery(e.target.value)}
    
                />
                <button className="search-button" onClick={handlesearch}>
                  Search
                </button>

            </form>

            {error && <div className="error-message">{error}</div> }

            {loading ? (
                <div className="loading"> Loading...</div>
            ):(<div className="movies-grid">
                {movies.map( (movie) =>
                    (
                        <MovieCard movie ={movie} key={movie.id}/>)
                )}
            </div>)}
            

        </div>
    )

}
export default Home