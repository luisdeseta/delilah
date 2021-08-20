-- MySQL Script generated by MySQL Workbench
-- jue 19 ago 2021 22:48:50
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Table `platos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `platos` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NULL,
  `shortname` VARCHAR(255) NULL,
  `price` DECIMAL(10,2) NULL,
  `description` VARCHAR(255) NULL,
  `photo` VARCHAR(45) NULL,
  `available` INT NULL COMMENT '1 - yes\n0 - no\n',
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `usuarios`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `userName` VARCHAR(45) NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `pass` VARCHAR(255) NOT NULL,
  `completeName` VARCHAR(45) NULL,
  `phone` VARCHAR(45) NULL,
  `adress` VARCHAR(45) NULL,
  `role` VARCHAR(45) NULL DEFAULT 'C',
  PRIMARY KEY (`id`),
  UNIQUE INDEX `usuario_UNIQUE` (`userName` ASC) VISIBLE,
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `favoritos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `favoritos` (
  `usuario_id` INT NOT NULL,
  `plato_id` INT NOT NULL,
  INDEX `fk_favoritos_usuarios_idx` (`usuario_id` ASC) VISIBLE,
  INDEX `fk_favoritos_platos1_idx` (`plato_id` ASC) VISIBLE,
  CONSTRAINT `fk_favoritos_usuarios`
    FOREIGN KEY (`usuario_id`)
    REFERENCES `usuarios` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_favoritos_platos1`
    FOREIGN KEY (`plato_id`)
    REFERENCES `platos` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `pedidos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `pedidos` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `usuario_id` INT NOT NULL,
  `date` DATETIME NOT NULL,
  `payment` VARCHAR(45) NULL,
  `total` DECIMAL(10,2) NULL,
  `status` VARCHAR(40) NULL COMMENT 'borrador\npagado / confirmado\nen preparacion\npreparado\nen camino\nentregado\n',
  `adress` VARCHAR(45) NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_pedidos_usuarios1_idx` (`usuario_id` ASC) VISIBLE,
  CONSTRAINT `fk_pedidos_usuarios1`
    FOREIGN KEY (`usuario_id`)
    REFERENCES `usuarios` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `items`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `items` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `pedido_id` INT NOT NULL,
  `plato_id` INT NOT NULL,
  `quantity` INT NULL,
  `price` DECIMAL(10,2) NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_items_pedidos1_idx` (`pedido_id` ASC) VISIBLE,
  INDEX `fk_items_platos1_idx` (`plato_id` ASC) VISIBLE,
  CONSTRAINT `fk_items_pedidos1`
    FOREIGN KEY (`pedido_id`)
    REFERENCES `pedidos` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_items_platos1`
    FOREIGN KEY (`plato_id`)
    REFERENCES `platos` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
