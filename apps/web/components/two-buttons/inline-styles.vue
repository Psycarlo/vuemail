<script setup lang="ts">
import { Button, Column, Row } from 'vuemail';
</script>

<template>
  <Row>
    <Column align="center">
      <Row>
        <td
          align="center"
          :colspan="1"
          :style="{ paddingRight: '16px', width: '50%' }"
        >
          <Button
            href="https://vuemail.dev"
            :style="{
              width: '100%',
              boxSizing: 'border-box',
              paddingLeft: '20px',
              paddingRight: '20px',
              paddingTop: '12px',
              paddingBottom: '12px',
              borderRadius: '8px',
              backgroundColor: 'rgb(79,70,229)',
              textAlign: 'center',
              fontWeight: 600,
              color: 'rgb(255,255,255)',
            }"
          >Login</Button>
        </td>
        <td
          align="center"
          :colspan="1"
          :style="{ paddingLeft: '16px', width: '50%' }"
        >
          <Button
            href="https://vuemail.dev"
            :style="{
              width: '100%',
              boxSizing: 'border-box',
              paddingLeft: '20px',
              paddingRight: '20px',
              paddingTop: '12px',
              paddingBottom: '12px',
              borderRadius: '8px',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'rgb(229,231,235)',
              textAlign: 'center',
              backgroundColor: 'rgb(255,255,255)',
              fontWeight: 600,
              color: 'rgb(17,24,39)',
            }"
          >Sign up</Button>
        </td>
      </Row>
    </Column>
  </Row>
</template>
