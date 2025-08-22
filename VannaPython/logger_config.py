import logging
import os
import sys

def setup_logging(module_name="vanna"):
    logger = logging.getLogger()
    
    if logger.handlers:
        return logging.getLogger(module_name)
    
    formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    
    log_level = os.getenv('LOG_LEVEL', 'INFO').upper()
    logger.setLevel(getattr(logging, log_level, logging.INFO))
    
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(formatter)
    console_handler.setLevel(logger.level)
    
    logger.addHandler(console_handler)
    
    return logging.getLogger(module_name)

def get_logger(module_name):
    return setup_logging(module_name)
