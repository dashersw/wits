#include "node_api.h"

int (* _logger_callback)(char * str);

void fprintf_override(char * a, char * b, char * c, int callback(char * str)) {
    if (_logger_callback) {
        char str[strlen(b)];

        sprintf(str, b, c);

        _logger_callback(str);

        return;
    }

    if (b == "set logger") {
        _logger_callback = callback;

        return;
    }

    printf(b, c);
}
