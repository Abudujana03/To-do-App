import React, { useState, useEffect } from 'react';

function Navbar() {
    //scroll navbar bg
    const [sticky, setSticky] = useState(false);
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 0) {
                setSticky(true);
            } else {
                setSticky(false);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);
    //scroll navbar bg

    return (
        <>
            <div className={`sticky top-0 z-40
                 ${sticky
                    ? "sticky-navbar shadow-md bg-white dark:bg-slate-700 dark:text-white duration-300 transition-all ease-in-out"
                    : ""
                }
                `} >
                <nav className={`border-gray-200 shadow-lg flex justify-between py-4`} >
                    <div className="flex flex-wrap px-20">
                        <p className="flex items-center space-x-3 ">
                            <span className="text-2xl font-semibold whitespace-nowrap cursor-pointer underline">Abudujana</span>
                        </p>
                   </div>
                   <div>
                   <h1 className="text-2xl font-semibold  text-center px-20 ">My Todos</h1>
                   </div>
                </nav>
            </div>
        </>
    );
}

export default Navbar;
