import React from 'react';
import { Box, AppBar, Toolbar, Typography, Container, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText, useTheme, useMediaQuery, Button } from '@mui/material';
import { Menu as MenuIcon, ChatOutlined, Chat, DescriptionOutlined, Description, PersonOutline, Person, ExitToApp as LogoutIcon, HomeOutlined, Home, GavelOutlined, Gavel } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import './MainLayout.css';

const MainLayout = ({ children, user, onLogout }) => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const theme = useTheme();
  const navigate = useNavigate();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const location = window.location.pathname;

  const menuItems = [
    { text: 'Home', icon: location === '/' ? <Home /> : <HomeOutlined />, path: '/' },
    { text: 'Chats', icon: location.startsWith('/chats') ? <Chat /> : <ChatOutlined />, path: '/chats' },
    { text: 'Documents', icon: location.startsWith('/documents') ? <Description /> : <DescriptionOutlined />, path: '/documents' },
    { text: 'Pro Bono', icon: location.startsWith('/probono') ? <Person /> : <PersonOutline />, path: '/probono' },
    { text: 'Case Analysis', icon: location.startsWith('/analysis') ? <Gavel /> : <GavelOutlined />, path: '/analysis' },
    { text: 'Profile', icon: location.startsWith('/profile') ? <Person /> : <PersonOutline />, path: '/profile' }
  ];

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#000000', color: 'white', cursor: 'pointer' }}>
      <List sx={{ width: 250, display:'flex', flexDirection:'column', marginTop:'30px', gap:'15px' }}>
        {menuItems.map((item) => (
          <ListItem
            button  
            key={item.text}
            onClick={() => {
              navigate(item.path);
              if (!isDesktop) setMobileOpen(false);
            }}
            sx={{
              borderLeft: (item.path === '/' ? location === item.path : location.startsWith(item.path)) ? '4px solid #DC004E' : '4px solid transparent',
              backgroundColor: (item.path === '/' ? location === item.path : location.startsWith(item.path)) ? 'rgba(220, 0, 78, 0.08)' : 'transparent',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                borderLeft: (item.path === '/' ? location === item.path : location.startsWith(item.path)) ? '4px solid #DC004E' : '4px solid rgba(220, 0, 78, 0.5)'
              }
            }}
          >
            <ListItemIcon sx={{ color: (item.path === '/' ? location === item.path : location.startsWith(item.path)) ? '#DC004E' : 'white' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} sx={{ color: (item.path === '/' ? location === item.path : location.startsWith(item.path)) ? '#DC004E' : 'white' }} />
          </ListItem>
        ))}
      </List>
      <Box sx={{ flexGrow: 1 }} />
      <List sx={{ mb: 2 }}>
        <ListItem 
          button 
          onClick={onLogout}
          sx={{
            '&:hover': {
              backgroundColor: 'rgba(245, 0, 0, 0.98)',
            },
            marginBottom:'50px'
          }}
        >
          <ListItemIcon sx={{ color: 'white' }}><LogoutIcon /></ListItemIcon>
          <ListItemText primary="Logout" sx={{ color: 'white' }} />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1, height:'75px', display:'flex', justifyContent:'center', backgroundColor: '#000000', borderBottom:'0.1px solid rgb(31, 31, 31)' }}>
        <Toolbar>
          {!isDesktop && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setMobileOpen(!mobileOpen)}
              sx={{ mr: 2 }}
            >
              <MenuIcon sx={{ color: 'white' }} />
            </IconButton>
          )}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <img
              src="/legalExpertai-logo.png"
              alt="LegalExpert.AI Logo"
              style={{ height: '30px', marginRight: '10px' }}
            />
            <Typography className='brand-head' variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
              LegalExpert.AI
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto', justifyContent: 'flex-end', gap: 2 }}>
            {user && (
              <Button
                sx={{
                  color: 'white',
                  textTransform: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  justifyContent: 'flex-end',
                }}
                endIcon={<PersonOutline />}
              >
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="subtitle2" sx={{ lineHeight: 1.2 }}>
                    {user.name}
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    {user.email}
                  </Typography>
                </Box>
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {isDesktop ? (
        <Drawer
          variant="permanent"
          sx={{
            backgroundColor:'#000000',
            fontFamily:'Nekst-Medium',
            width: 250,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: 250,
              boxSizing: 'border-box',
              mt: 8
            }
          }}
        >
          {drawer}
        </Drawer>
      ) : (
        <Drawer
          variant="temporary"
          anchor="left"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': { width: 250, boxSizing: 'border-box' }
          }}
        >
          {drawer}
        </Drawer>
      )}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          backgroundColor: theme.palette.background.default,
          minHeight: '100vh',
          width: '100%'
        }}
      >
        <Container 
          maxWidth="lg" 
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            height: '100%',
            py: 4,
            width: '100%'
          }}
        >
          {children}
        </Container>
      </Box>
    </Box>
  );
};

export default MainLayout;