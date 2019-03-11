#include <stdio.h>
#include "string.h"
#include <stdarg.h>

void (* _logger_callback)(char * str);

void fprintf_override(const char * format, ...) {
    va_list arg;
    va_start(arg, format);

    if (_logger_callback) {
        char str[strlen(format)];

        vsprintf(str, format, arg);

        _logger_callback(str);
    } else {
        vprintf(format, arg);
    }

    va_end(arg);
}

void set_logger(void callback(char * str)) {
    _logger_callback = callback;
}
