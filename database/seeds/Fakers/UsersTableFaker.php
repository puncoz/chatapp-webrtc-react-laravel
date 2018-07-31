<?php

use Illuminate\Database\Seeder;

/**
 * Class UsersTableFaker
 */
class UsersTableFaker extends Seeder
{
    /**
     * Run Seeder
     */
    public function run()
    {
        factory(\App\User::class, 2)->create();
    }
}
