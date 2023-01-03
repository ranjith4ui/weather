import React from 'react'
import "./Search.css"


function Search({value, data, change, submit}) {
    return (
        <>
            <div className="search__container" >
                {/* <input type="text" value={value} onChange={change} placeholder="e.g. Chennai,India" className="search__input" />
                <input type='button' onClick={submit} value="Search" /> */}
                <div className="flexContainer">
                    <input type="text" value={value} onChange={change} placeholder="e.g. Chennai,India" className="search__input"/>
                    <button type="button" className="search" onClick={submit}>Search</button>
                </div>
            </div>

            
        </>
    )
}

export default Search
