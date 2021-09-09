	 INSERT INTO delilah.usuarios (userName,email,pass,completeName,phone,adress,`role`) VALUES
	 ('admin','admin@admin.com.ar','$2b$10$CEjyTVtecHIsiDZYN69WBOe04U1ZXOg/LzaRIakiiTJ18c0D6q8gC','Administrador','1','calle 1','admin'),
	 ('luis2','luis2@algo.com.ar','$2b$10$ofmF4KyrKkF1dHsXUYXFs.dW2ODtsE.EuaZ525hnmIbaJPLLWcca6','Luis De Seta2','1116','Calle Siempre Viva 123','user'),
	 ('lucho','lucho@lucho.com.ar','$2b$10$IUWLkOpiRuF3drOWiUaWjuICQjNR.lcNbn/Qo8Jjp7mqy7rT1j9Iu','Luis De Seta2','1116','calle 123','user'),
	 ('LUCHODEV','eduardo@eduardo.com.ar','$2b$10$qaJpBJvQCehHlKbwEYtSA./klTubs55yzgwFJAWEqQ8/ZPhq5D0Vy','Luis Eduardo','1116','calle 123','user');
	 
 INSERT INTO delilah.platos (name,shortname,price,description,photo,available) VALUES
	 ('Hamburguesa','Ham',166,'hambuerguesa compelata','url',1),
	 ('Helado guacamole','HeladoG',940,'Helado de Oreo, banana split y Kinder','url',1),
	 ('Ensalada de Palta','EnsPalt',150,'Ensalada de palta y semillas','url',1),
	 ('Hamburguesa de Carne','HamCarne',250,'Hamburguesa de carne completa','url',1),
	 ('Hamburguesa de Cordero','HamCord',350,'Hamburguesa de cordero con cebollas','url',1),
	 ('Sandwich vegetariano','SandVeg',355,'Sandwich vegatariano con mostaza organica','url',1),
	 ('Ensalada Ceasar','EnsCes',450,'Ensalada ceasar con pollo','url',1),
	 ('Pizza Muzzarela','Muzza',950,'Pizza grande de muzzarela','url',1),
	 ('Pizza Especial','PizzEsp',1150,'Pizza especial con jamon y morrones','url',1),
	 ('Sopa','HeladoG',940,'Sopa de verduras','url',1);
INSERT INTO delilah.platos (name,shortname,price,description,photo,available) VALUES
	 ('Sopa de carne','SopCarne',940,'Sopa de carne con legumbres','url',1),
	 ('Rissotto','Risso',1100,'Rissotto italiano','url',1),
	 ('Rissotto con hongos','RissoHong',1100,'Rissotto italiano','url',1);
	 
INSERT INTO delilah.pedidos (usuario_id,`date`,payment,total,status,adress) VALUES
	 (2,'2021-08-18 15:45:06',NULL,NULL,'pagado',NULL),
	 (3,'2021-08-30 23:17:11',NULL,NULL,'nuevo',NULL);
	 
INSERT INTO delilah.items (pedido_id,plato_id,quantity,item_price) VALUES
	 (2,12,22,950),
	 (2,1,43,940),
	 (2,10,22,355),
	 (2,11,22,355),
	 (1,2,22,355),
	 (1,11,22,355),
	 (1,11,22,355),
	 (1,11,22,355)
	 
INSERT INTO delilah.favoritos (usuario_id,plato_id) VALUES
	 (2,1),
	 (2,1),
	 (2,2),
	 (3,2)
	 
