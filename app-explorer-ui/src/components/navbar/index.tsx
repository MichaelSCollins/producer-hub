import React from 'react';
import NavItems from './items';
import NavWrapper from './wrapper';
import NavLogo from './logo';

const Navbar = () => {
    return (
        <NavWrapper>
            <NavLogo />
            <NavItems />
        </NavWrapper>
    );
};


export default Navbar;
